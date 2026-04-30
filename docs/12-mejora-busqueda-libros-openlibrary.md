# 12 - Mejora de búsqueda de libros en OpenLibrary

## Contexto

Se añade funcionalidad para buscar libros en OpenLibrary al añadir un libro, permitiendo rellenar automáticamente título, autor, fecha de lanzamiento y sinopsis.

La búsqueda mejora el manejo de títulos traducidos buscando primero por título + autor, luego por título solo, y finalmente filtrando libros del autor para encontrar títulos originales que coincidan.

## Cambios implementados

1. Nuevo endpoint `POST /api/libros/search`:
   - Recibe `titulo` y `autor`.
   - Busca en OpenLibrary con estrategias similares a la búsqueda de sinopsis.
   - Incluye búsqueda adicional por autor para encontrar títulos originales.
   - Devuelve el libro encontrado con datos normalizados.

2. UI en `components/books/BooksApp.tsx`:
   - Botón "Buscar en OpenLibrary" en el formulario de añadir libro.
   - Llama al endpoint y rellena los campos del formulario si encuentra el libro.

## Impacto

- Facilita añadir libros con datos completos desde OpenLibrary.
- Mejora la precisión en búsquedas de títulos traducidos al filtrar por autor y buscar títulos originales.
- Mantiene la resiliencia con fallbacks si no se encuentra el libro.</content>
<parameter name="filePath">c:\Users\chris\Desktop\RepoPrueba\docs\12-mejora-busqueda-libros-openlibrary.md