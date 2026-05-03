export const renderBookRatingStars = (valoracion: number | null): string => {
  if (!valoracion || valoracion < 1) {
    return "Sin valorar";
  }

  const fullStars = "★".repeat(valoracion);
  const emptyStars = "☆".repeat(5 - valoracion);
  return `${fullStars}${emptyStars}`;
};
