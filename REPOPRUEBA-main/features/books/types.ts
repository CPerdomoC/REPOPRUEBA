export const BOOK_STATUS = {
  PENDIENTE: "PENDIENTE",
  LEIDO: "LEIDO",
} as const;

export type BookStatus = (typeof BOOK_STATUS)[keyof typeof BOOK_STATUS];

export type Book = {
  id: string;
  titulo: string;
  autor: string;
  sinopsis: string | null;
  fechaLanzamiento: string | null;
  paisOrigen: string | null;
  fechaInicioLectura: string | null;
  valoracion: number | null;
  estado: BookStatus;
  fechaLectura: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookInput = {
  titulo: string;
  autor: string;
  sinopsis?: string | null;
  fechaLanzamiento?: string | null;
  paisOrigen?: string | null;
  fechaInicioLectura?: string | null;
};

export type UpdateBookStatusInput = {
  estado: BookStatus;
  fechaInicioLectura?: string | null;
  fechaLectura?: string | null;
};

export type UpdateBookRatingInput = {
  valoracion: number | null;
};
