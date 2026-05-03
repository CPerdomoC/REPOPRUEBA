# UI más profesional + sinopsis automática

## Objetivo

Mejorar la estética visual de la app y reducir la carga manual del usuario al completar datos del libro.

## Cambios implementados

### 1) Fondo y estilo general en blanco

- Se actualizó la interfaz principal para usar fondo blanco sólido.
- Se eliminaron estilos visuales oscuros/degradados en la vista principal para reforzar una estética más limpia y profesional.

Archivo afectado:

- `components/books/BooksApp.tsx`

### 2) Botones de acción con color semántico

- **Marcar leído**: botón verde (acción positiva/confirmación).
- **Eliminar**: botón rojo (acción destructiva).
- Se mejoraron estilos de botones secundarios con bordes, hover y consistencia visual.

Archivo afectado:

- `components/books/BooksApp.tsx`

### 3) Búsqueda automática de sinopsis al confirmar lectura

- Al pulsar **Marcar leído**, si el libro no tiene sinopsis:
  - el sistema llama a `POST /api/libros/sinopsis`,
  - consulta una fuente abierta (`Open Library`),
  - si encuentra descripción/sinopsis, la guarda automáticamente en el libro local.
- Si no se encuentra sinopsis o falla la consulta, el libro igualmente se marca como leído (comportamiento no bloqueante).

Archivos afectados:

- `components/books/BooksApp.tsx`
- `app/api/libros/sinopsis/route.ts`

## Fuente abierta usada

- API pública de Open Library:
  - búsqueda: `https://openlibrary.org/search.json?title=...&author=...`
  - detalle de obra: `https://openlibrary.org/works/{id}.json`

No requiere API key y permite un primer enriquecimiento automático de datos.

## Impacto técnico

- No se añadieron dependencias nuevas.
- Se mantiene compatibilidad con el flujo actual de almacenamiento local (`localStorage`).
- Se añade un Route Handler de Next.js para centralizar la integración externa y evitar exponer detalles de la API en la UI.

## Limitaciones conocidas

- La calidad de la sinopsis depende de la disponibilidad de metadatos en Open Library.
- Algunos libros en español o ediciones muy específicas pueden no devolver descripción útil.
- La estrategia actual usa el primer resultado; en el futuro se puede mejorar con ranking/fuzzy matching.

## Próximas mejoras sugeridas

- Añadir fallback de segunda fuente abierta (por ejemplo Wikipedia) cuando Open Library no tenga sinopsis.
- Guardar la fuente y fecha de enriquecimiento para trazabilidad.
- Permitir refrescar manualmente sinopsis desde la ficha del libro.
