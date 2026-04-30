# 11 - Mejora de busqueda de sinopsis en OpenLibrary

## Contexto

Algunos libros devolvian `sinopsis: null` aunque existian en OpenLibrary, por ejemplo:

- "Si esto es un hombre" (Primo Levi)

La busqueda anterior era demasiado estricta (titulo + autor exactos con `limit=1`).

## Solucion aplicada

Se mejora `app/api/libros/sinopsis/route.ts` con una estrategia de busqueda por fases:

1. Busqueda por `title + author`.
2. Si no hay resultado util, busqueda solo por `title`.
3. Reintentos con variaciones del titulo:
   - titulo original,
   - titulo normalizado (sin acentos),
   - alias conocidos (ej. `"si esto es un hombre"` -> `"se questo e un uomo"`, `"if this is a man"`).
4. Para cada resultado:
   - se intenta primero `first_sentence`,
   - si no existe, se consulta la obra (`/works/...`) para extraer `description`.

Ademas:

- Se mantiene timeout de 8s por llamada externa.
- Se conserva el fallback estable a `{ sinopsis: null }` si OpenLibrary no responde o no hay datos.

## Impacto

- Aumenta significativamente la tasa de acierto de sinopsis en titulos traducidos o con variaciones.
- Se mantiene la resiliencia del endpoint sin romper la experiencia de usuario.
