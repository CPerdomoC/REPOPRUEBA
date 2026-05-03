# 10 - Fix error 500 en API de sinopsis

## Contexto

En algunas llamadas a `POST /api/libros/sinopsis` aparecia:

- `500 Internal Server Error`
- `{"error":"Error al buscar sinopsis","detail":"TypeError: fetch failed"}`

El error ocurria de forma intermitente al consultar OpenLibrary desde el backend.

## Causa raiz

La ruta hacia `https://openlibrary.org/...` podia fallar por red, DNS, TLS o timeout.
Cuando eso pasaba, la excepcion llegaba al `catch` general y se devolvia `500`.

## Solucion aplicada

En `app/api/libros/sinopsis/route.ts`:

- Se añade `fetchJsonSafe` con:
  - timeout (`AbortSignal.timeout(8000)`),
  - control de `response.ok`,
  - manejo de excepciones devolviendo `null`.
- Se sustituyen los `fetch` directos por `fetchJsonSafe` para:
  - busqueda (`/search.json`),
  - detalle de obra (`${workKey}.json`).
- Si OpenLibrary falla, la API responde de forma degradada y estable:
  - `{ sinopsis: null, source: "openlibrary" }`
- Se mantiene `console.error` en servidor para trazabilidad.

## Impacto

- Ya no se propaga `500` al cliente por fallos externos puntuales.
- El flujo de "Marcar leido" continua funcionando sin bloquear la UI.
- Si no hay respuesta fiable de OpenLibrary, se guarda sinopsis nula como fallback.
