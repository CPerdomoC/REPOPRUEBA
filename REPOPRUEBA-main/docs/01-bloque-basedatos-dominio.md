# Bloque 2 - Base de datos y dominio de libros

## Que se implemento

- Script SQL inicial `basedatos/001_init_books.sql` con tabla `books`.
- Carga inicial de libros de ejemplo en el script SQL.
- Capa `core` para variables de entorno y conexion PostgreSQL:
  - `core/env.ts`
  - `core/db.ts`
- Dominio `features/books`:
  - `types.ts` (tipos y estados)
  - `schema.ts` (validaciones con Zod)
  - `repository.ts` (operaciones de persistencia)

## Modelo de datos

Tabla `books`:

- `id` (UUID)
- `titulo` (texto requerido)
- `autor` (texto requerido)
- `sinopsis` (texto opcional)
- `fecha_lanzamiento` (fecha opcional)
- `pais_origen` (texto opcional)
- `fecha_inicio_lectura` (fecha opcional)
- `valoracion` (entero opcional entre 1 y 5)
- `estado` (`PENDIENTE` o `LEIDO`)
- `fecha_lectura` (fecha opcional)
- `created_at`, `updated_at` (timestamps)

## Decisiones tecnicas

1. Estado inicial del libro: `PENDIENTE`.
2. Al marcar como `LEIDO`, se asigna fecha de lectura automatica si no se envia.
3. Se agregan metadatos editoriales basicos: sinopsis, fecha de lanzamiento y pais de origen.
4. La valoracion se modela como estrellas de 1 a 5 con validacion en BD y Zod.
5. El repositorio expone metodos simples para CRUD, conteo por estado y actualizacion de valoracion.
