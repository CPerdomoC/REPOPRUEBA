import { db } from "@/core/db";
import {
  BOOK_STATUS,
  Book,
  BookStatus,
  CreateBookInput,
  UpdateBookRatingInput,
  UpdateBookStatusInput,
} from "@/features/books/types";

type BookRow = {
  id: string;
  titulo: string;
  autor: string;
  sinopsis: string | null;
  fecha_lanzamiento: string | null;
  pais_origen: string | null;
  fecha_inicio_lectura: string | null;
  valoracion: number | null;
  estado: BookStatus;
  fecha_lectura: string | null;
  created_at: string;
  updated_at: string;
};

const mapBookRow = (row: BookRow): Book => ({
  id: row.id,
  titulo: row.titulo,
  autor: row.autor,
  sinopsis: row.sinopsis,
  fechaLanzamiento: row.fecha_lanzamiento,
  paisOrigen: row.pais_origen,
  fechaInicioLectura: row.fecha_inicio_lectura,
  valoracion: row.valoracion,
  estado: row.estado,
  fechaLectura: row.fecha_lectura,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const booksRepository = {
  async listAll(): Promise<Book[]> {
    const result = await db.query<BookRow>(
      "SELECT id, titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, valoracion, estado, fecha_lectura, created_at, updated_at FROM books ORDER BY created_at DESC",
    );
    return result.rows.map(mapBookRow);
  },

  async countByStatus(): Promise<{ leidos: number; pendientes: number; total: number }> {
    const result = await db.query<{
      leidos: string;
      pendientes: string;
      total: string;
    }>(
      `SELECT
        COUNT(*) FILTER (WHERE estado = $1)::text AS leidos,
        COUNT(*) FILTER (WHERE estado = $2)::text AS pendientes,
        COUNT(*)::text AS total
      FROM books`,
      [BOOK_STATUS.LEIDO, BOOK_STATUS.PENDIENTE],
    );
    const row = result.rows[0];
    return {
      leidos: Number(row?.leidos ?? 0),
      pendientes: Number(row?.pendientes ?? 0),
      total: Number(row?.total ?? 0),
    };
  },

  async create(input: CreateBookInput): Promise<Book> {
    const result = await db.query<BookRow>(
      `INSERT INTO books (titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, valoracion, estado, fecha_lectura, created_at, updated_at`,
      [
        input.titulo,
        input.autor,
        input.sinopsis ?? null,
        input.fechaLanzamiento ?? null,
        input.paisOrigen ?? null,
        input.fechaInicioLectura ?? null,
        BOOK_STATUS.PENDIENTE,
      ],
    );
    return mapBookRow(result.rows[0]);
  },

  async updateStatus(id: string, input: UpdateBookStatusInput): Promise<Book | null> {
    const fechaLectura =
      input.estado === BOOK_STATUS.LEIDO
        ? input.fechaLectura ?? new Date().toISOString().slice(0, 10)
        : null;

    const result = await db.query<BookRow>(
      `UPDATE books
       SET estado = $2,
           fecha_inicio_lectura = COALESCE($3, fecha_inicio_lectura),
           fecha_lectura = $4,
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, valoracion, estado, fecha_lectura, created_at, updated_at`,
      [id, input.estado, input.fechaInicioLectura ?? null, fechaLectura],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return mapBookRow(result.rows[0]);
  },

  async updateRating(id: string, input: UpdateBookRatingInput): Promise<Book | null> {
    const result = await db.query<BookRow>(
      `UPDATE books
       SET valoracion = $2,
           updated_at = NOW()
       WHERE id = $1 AND estado = $3
       RETURNING id, titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, valoracion, estado, fecha_lectura, created_at, updated_at`,
      [id, input.valoracion, BOOK_STATUS.LEIDO],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return mapBookRow(result.rows[0]);
  },

  async findById(id: string): Promise<Book | null> {
    const result = await db.query<BookRow>(
      "SELECT id, titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, valoracion, estado, fecha_lectura, created_at, updated_at FROM books WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return mapBookRow(result.rows[0]);
  },

  async remove(id: string): Promise<boolean> {
    const result = await db.query("DELETE FROM books WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
