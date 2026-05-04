"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import CountrySelect, { COUNTRY_LIST } from "@/components/CountrySelect";
import { BOOK_STATUS, Book, BookStatus } from "@/features/books/types";
import { renderBookRatingStars } from "@/features/books/rating";

type ApiResponse = {
  libros: Book[];
  resumen: { leidos: number; pendientes: number; total: number };
};

type Filtro = "TODOS" | BookStatus;

const initialForm = {
  titulo: "",
  autor: "",
  paisOrigen: "",
  paisOrigenCodigo: "",
  fechaLanzamiento: "",
  fechaInicioLectura: "",
  sinopsis: "",
};

const STORAGE_KEY = "biblioteca-libros-v1";

const initialBooks: Book[] = [
  {
    id: "seed-normal-people",
    titulo: "Normal People",
    autor: "Sally Rooney",
    sinopsis:
      "Marianne y Connell construyen una relacion intensa y cambiante desde la adolescencia hasta la adultez temprana.",
    fechaLanzamiento: "2018-08-28",
    paisOrigen: "Irlanda",
    fechaInicioLectura: null,
    valoracion: null,
    estado: BOOK_STATUS.PENDIENTE,
    fechaLectura: null,
    createdAt: "2018-08-28T00:00:00.000Z",
    updatedAt: "2018-08-28T00:00:00.000Z",
  },
];

const buildResumen = (libros: Book[]) => {
  const leidos = libros.filter((libro) => libro.estado === BOOK_STATUS.LEIDO).length;
  const pendientes = libros.filter(
    (libro) => libro.estado === BOOK_STATUS.PENDIENTE,
  ).length;
  return { leidos, pendientes, total: libros.length };
};

const createData = (libros: Book[]): ApiResponse => ({
  libros,
  resumen: buildResumen(libros),
});

const loadLocalData = (): ApiResponse => {
  if (typeof window === "undefined") {
    return createData(initialBooks);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createData(initialBooks);
  }

  try {
    const parsed = JSON.parse(raw) as Book[];
    return createData(parsed);
  } catch {
    return createData(initialBooks);
  }
};

export function BooksApp() {
  const [data, setData] = useState<ApiResponse>(() => createData(initialBooks));
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setData(loadLocalData());
  }, []);

  const persistBooks = (libros: Book[]) => {
    const nextData = createData(libros);
    setData(nextData);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
    }
  };

  const loadBooks = () => {
    try {
      setError(null);
      const localData = loadLocalData();
      setData(localData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const librosFiltrados = useMemo(() => {
    if (filtro === "TODOS") return data.libros;
    return data.libros.filter((libro) => libro.estado === filtro);
  }, [data.libros, filtro]);

  const getCountryLabelByCode = (code: string) => {
    const country = COUNTRY_LIST.find((item) => item.value === code.toLowerCase());
    return country?.label ?? "";
  };

  const getCountryFlagUrl = (code: string | null | undefined) =>
    code ? `https://flagcdn.com/${code.toLowerCase()}.svg` : null;

  const getCountryLabel = (code: string | null | undefined) =>
    code ? getCountryLabelByCode(code) : null;

  const getFlagUrlByLabel = (label: string | null | undefined) =>
    getCountryFlagUrl(
      COUNTRY_LIST.find((country) => country.label.toLowerCase() === label?.toLowerCase())?.value ?? null,
    );

  const onCreateBook = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.paisOrigenCodigo) {
      setError("Debes seleccionar el país de origen del libro.");
      return;
    }

    try {
      const now = new Date().toISOString();
      const nombrePais = getCountryLabel(form.paisOrigenCodigo) || form.paisOrigen;
      const nuevoLibro: Book = {
        id: crypto.randomUUID(),
        titulo: form.titulo,
        autor: form.autor,
        paisOrigen: nombrePais || null,
        fechaLanzamiento: form.fechaLanzamiento || null,
        fechaInicioLectura: form.fechaInicioLectura || null,
        sinopsis: sinopsis || null,
        valoracion: null,
        estado: BOOK_STATUS.PENDIENTE,
        fechaLectura: null,
        createdAt: now,
        updatedAt: now,
      };

      setForm(initialForm);
      persistBooks([nuevoLibro, ...data.libros]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const updateStatus = (
    id: string,
    estado: BookStatus,
    fechaInicioLectura?: string | null,
  ) => {
    setBusyId(id);
    setError(null);
    try {
      const librosActualizados = data.libros.map((libro) => {
        if (libro.id !== id) return libro;

        const fechaLectura =
          estado === BOOK_STATUS.LEIDO
            ? libro.fechaLectura ?? new Date().toISOString().slice(0, 10)
            : null;

        return {
          ...libro,
          estado,
          fechaInicioLectura: fechaInicioLectura ?? libro.fechaInicioLectura,
          fechaLectura,
          valoracion: estado === BOOK_STATUS.PENDIENTE ? null : libro.valoracion,
          updatedAt: new Date().toISOString(),
        };
      });
      persistBooks(librosActualizados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusyId(null);
    }
  };

  const fillSynopsisFromInternet = async (book: Book): Promise<string | null> => {
    return fetchSynopsis(book.titulo, book.autor);
  };

  const fillSynopsisFromInternet = async (book: Book): Promise<string | null> => {
    try {
      const response = await fetch("/api/libros/sinopsis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: book.titulo, autor: book.autor }),
      });

      if (!response.ok) return null;
      const payload = (await response.json()) as { sinopsis?: string | null };
      return payload.sinopsis ?? null;
    } catch {
      return null;
    }
  };

  const markAsRead = async (book: Book) => {
    setBusyId(book.id);
    setError(null);
    try {
      const fetchedSynopsis = await fillSynopsisFromInternet(book);
      const librosActualizados = data.libros.map((libro) => {
        if (libro.id !== book.id) return libro;

        return {
          ...libro,
          estado: BOOK_STATUS.LEIDO,
          fechaInicioLectura:
            libro.fechaInicioLectura ?? new Date().toISOString().slice(0, 10),
          fechaLectura: libro.fechaLectura ?? new Date().toISOString().slice(0, 10),
          valoracion: libro.valoracion,
          sinopsis: libro.sinopsis ?? fetchedSynopsis,
          updatedAt: new Date().toISOString(),
        };
      });
      persistBooks(librosActualizados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusyId(null);
    }
  };

  const updateRating = (id: string, valoracion: number) => {
    setBusyId(id);
    setError(null);
    try {
      const librosActualizados = data.libros.map((libro) => {
        if (libro.id !== id) return libro;
        if (libro.estado !== BOOK_STATUS.LEIDO) return libro;
        return {
          ...libro,
          valoracion,
          updatedAt: new Date().toISOString(),
        };
      });
      persistBooks(librosActualizados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusyId(null);
    }
  };

  const removeBook = (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      const librosActualizados = data.libros.filter((libro) => libro.id !== id);
      persistBooks(librosActualizados);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Biblioteca personal</h1>
          <p className="mt-2 text-zinc-800">
            Organiza tus libros, marca lectura y valora con estrellas.
          </p>
        </header>

        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </p>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total" value={data.resumen.total} />
          <StatCard label="Leídos" value={data.resumen.leidos} />
          <StatCard label="Pendientes" value={data.resumen.pendientes} />
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Añadir libro</h2>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onCreateBook}>
            <input
              required
              className="rounded-lg border px-3 py-2"
              placeholder="Título"
              value={form.titulo}
              onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
            />
            <input
              required
              className="rounded-lg border px-3 py-2"
              placeholder="Autor"
              value={form.autor}
              onChange={(e) => setForm((prev) => ({ ...prev, autor: e.target.value }))}
            />
            <div className="sm:col-span-2">
            <CountrySelect
              value={form.paisOrigenCodigo}
              onChange={(iso2) =>
                setForm((prev) => ({
                  ...prev,
                  paisOrigenCodigo: iso2,
                  paisOrigen: getCountryLabelByCode(iso2),
                }))
              }
              placeholder="Selecciona el país de origen"
              label="País de origen"
            />
          </div>
            <input
              type="date"
              className="rounded-lg border px-3 py-2"
              value={form.fechaLanzamiento}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fechaLanzamiento: e.target.value }))
              }
            />
            <input
              type="date"
              className="rounded-lg border px-3 py-2"
              value={form.fechaInicioLectura}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fechaInicioLectura: e.target.value }))
              }
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700"
              >
                Guardar libro
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Tu colección</h2>
            <div className="flex gap-2">
              {(["TODOS", BOOK_STATUS.PENDIENTE, BOOK_STATUS.LEIDO] as const).map((item) => (
                <button
                  key={item}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    filtro === item
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                  }`}
                  onClick={() => setFiltro(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={loadBooks}
              className="rounded-lg border border-zinc-300 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-50"
            >
              Recargar desde local
            </button>
          </div>

          {librosFiltrados.length === 0 ? (
            <p className="mt-4 text-zinc-700">No hay libros para este filtro.</p>
          ) : null}

          <ul className="mt-4 space-y-4">
            {librosFiltrados.map((libro) => (
            <li key={libro.id} className="group relative rounded-xl border p-4">
              {libro.paisOrigen ? (
                <div className="absolute right-4 top-4 flex items-center justify-center">
                  <div className="h-8 w-8 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm">
                    {getFlagUrlByLabel(libro.paisOrigen) ? (
                      <img
                        src={getFlagUrlByLabel(libro.paisOrigen) ?? undefined}
                        alt={`Bandera de ${libro.paisOrigen}`}
                        title={`Bandera de ${libro.paisOrigen}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs font-semibold text-zinc-500">
                        {libro.paisOrigen?.trim()[0]?.toUpperCase() ?? "?"}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{libro.titulo}</h3>
                    <p className="text-sm text-zinc-800">
                      {libro.autor} · {libro.paisOrigen ?? "País desconocido"} ·{" "}
                      {libro.fechaLanzamiento ?? "Fecha no disponible"}
                    </p>
                    <p className="text-sm text-zinc-800">
                      Inicio lectura: {libro.fechaInicioLectura ?? "Sin definir"} · Fin lectura:{" "}
                      {libro.fechaLectura ?? "Sin finalizar"}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs">
                    {libro.estado}
                  </span>
                </div>

                <p className="mt-3 text-sm text-zinc-800">
                  {libro.sinopsis ?? "Sin sinopsis"}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm">Valoración:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={`${libro.id}-star-${star}`}
                      type="button"
                      disabled={busyId === libro.id || libro.estado !== BOOK_STATUS.LEIDO}
                      onClick={() =>
                        libro.estado === BOOK_STATUS.LEIDO
                          ? void updateRating(libro.id, star)
                          : undefined
                      }
                      className={`text-lg ${
                        star <= (libro.valoracion ?? 0) ? "text-amber-500" : "text-zinc-400"
                      }`}
                      aria-label={`Valorar con ${star} estrellas`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-zinc-700">
                    {libro.estado === BOOK_STATUS.LEIDO
                      ? renderBookRatingStars(libro.valoracion)
                      : "Valora al finalizar"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === libro.id}
                    onClick={() => void markAsRead(libro)}
                    className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-60"
                  >
                    Marcar leído
                  </button>
                  <button
                    type="button"
                    disabled={busyId === libro.id}
                    onClick={() => void updateStatus(libro.id, BOOK_STATUS.PENDIENTE)}
                    className="rounded-lg border border-zinc-300 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
                  >
                    Marcar pendiente
                  </button>
                  <button
                    type="button"
                    disabled={busyId === libro.id}
                    onClick={() => void removeBook(libro.id)}
                    className="rounded-lg border border-red-300 bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200 disabled:opacity-60"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-zinc-800">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </article>
  );
}
