# Bloque 3 y 4 - API y UI funcional

## Que se implemento

- API de libros en App Router:
  - `GET /api/libros` (listado + resumen)
  - `POST /api/libros` (crear libro)
  - `PATCH /api/libros/[id]` (estado o valoracion)
  - `DELETE /api/libros/[id]` (eliminar libro)
- Pantalla principal funcional en `app/page.tsx`:
  - Conteo de total, leidos y pendientes
  - Formulario para crear libros
  - Filtros por estado
  - Acciones de marcar leido/pendiente
  - Valoracion con estrellas 1-5
  - Eliminacion de libros

## Decisiones

1. Sin autenticacion por ser app de uso personal.
2. El `PATCH` usa un unico endpoint para cambios de estado o valoracion.
3. La UI consume la API interna con `fetch` y refresca datos tras cada accion.
