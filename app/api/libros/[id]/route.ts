import { NextResponse } from "next/server";
import { updateBookRatingSchema, updateBookStatusSchema } from "@/features/books/schema";
import { booksRepository } from "@/features/books/repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    if ("estado" in body) {
      const parsedStatus = updateBookStatusSchema.safeParse(body);
      if (!parsedStatus.success) {
        return NextResponse.json(
          { error: "Datos de estado invalidos", issues: parsedStatus.error.flatten() },
          { status: 400 },
        );
      }

      const libro = await booksRepository.updateStatus(id, parsedStatus.data);
      if (!libro) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
      }

      return NextResponse.json({ libro });
    }

    if ("valoracion" in body) {
      const existing = await booksRepository.findById(id);
      if (!existing) {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
      }
      if (existing.estado !== "LEIDO") {
        return NextResponse.json(
          { error: "Solo puedes valorar un libro cuando esta marcado como LEIDO." },
          { status: 400 },
        );
      }

      const parsedRating = updateBookRatingSchema.safeParse(body);
      if (!parsedRating.success) {
        return NextResponse.json(
          { error: "Datos de valoracion invalidos", issues: parsedRating.error.flatten() },
          { status: 400 },
        );
      }

      const libro = await booksRepository.updateRating(id, parsedRating.data);
      if (!libro) {
        return NextResponse.json(
          { error: "No se pudo actualizar la valoracion del libro." },
          { status: 400 },
        );
      }

      return NextResponse.json({ libro });
    }

    return NextResponse.json(
      { error: "Body invalido. Debe incluir `estado` o `valoracion`." },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar el libro", detail: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const deleted = await booksRepository.remove(id);
    if (!deleted) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo eliminar el libro", detail: String(error) },
      { status: 500 },
    );
  }
}
