import { z } from "zod";
import { BOOK_STATUS } from "@/features/books/types";

export const createBookSchema = z.object({
  titulo: z.string().trim().min(1, "El titulo es obligatorio").max(180),
  autor: z.string().trim().min(1, "El autor es obligatorio").max(120),
  sinopsis: z.string().trim().max(2000).nullable().optional(),
  fechaLanzamiento: z.iso.date().nullable().optional(),
  paisOrigen: z.string().trim().max(120).nullable().optional(),
  fechaInicioLectura: z.iso.date().nullable().optional(),
});

export const updateBookStatusSchema = z.object({
  estado: z.enum([BOOK_STATUS.PENDIENTE, BOOK_STATUS.LEIDO]),
  fechaInicioLectura: z.iso.date().nullable().optional(),
  fechaLectura: z.iso.date().nullable().optional(),
});

export const updateBookRatingSchema = z.object({
  valoracion: z.number().int().min(1).max(5).nullable(),
});
