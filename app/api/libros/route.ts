import { NextResponse } from "next/server";
import { createBookSchema } from "@/features/books/schema";
import { booksRepository } from "@/features/books/repository";
import { env } from "@/core/env";

const checkDatabaseConnection = () => {
  if (!env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured", detail: "DATABASE_URL environment variable is not set." },
      { status: 503 },
    );
  }
  return null;
};

export async function GET() {
  const dbError = checkDatabaseConnection();
  if (dbError) return dbError;

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
  const dbError = checkDatabaseConnection();
  if (dbError) return dbError;

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
