import { NextResponse } from "next/server";
import { createBookSchema } from "@/features/books/schema";
import { booksRepository } from "@/features/books/repository";

export async function GET() {
  try {
    const [libros, resumen] = await Promise.all([
      booksRepository.listAll(),
      booksRepository.countByStatus(),
    ]);

    return NextResponse.json({ libros, resumen });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudieron obtener los libros", detail: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createBookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const libro = await booksRepository.create(parsed.data);
    return NextResponse.json({ libro }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo crear el libro", detail: String(error) },
      { status: 500 },
    );
  }
}
