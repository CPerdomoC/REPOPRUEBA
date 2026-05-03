# 09 - Fix hydration mismatch en BooksApp

## Contexto

Al cargar la home y tras añadir/marcar libros, aparecia un error recuperable de React:

- `Hydration failed because the server rendered text didn't match the client`

El fallo se observaba en las tarjetas de resumen (`Total`, `Leidos`, `Pendientes`) del componente `BooksApp`.

## Causa raiz

Habia diferencias entre el primer render del servidor (SSR) y el primer render del cliente:

1. El estado inicial se calculaba con `loadLocalData()` dentro de `useState`.
   - En servidor no hay `window`, por lo que se usaban datos base.
   - En cliente si hay `localStorage`, por lo que podia devolver datos distintos.
2. El `initialBooks` de modulo usaba valores no deterministas (`crypto.randomUUID()` y fechas con `new Date()`), que pueden diferir entre entornos.

## Solucion aplicada

En `components/books/BooksApp.tsx`:

- Se cambia la inicializacion de estado para que sea determinista en SSR/CSR:
  - ahora arranca con `createData(initialBooks)`.
- Se carga `localStorage` solo despues de montar el componente con `useEffect`.
- Se vuelve determinista el `initialBooks` de semilla:
  - `id` fijo (`seed-normal-people`).
  - fechas fijas ISO.

## Impacto

- Se elimina el desajuste de hidratacion en la UI de resumen.
- Se mantiene el comportamiento funcional:
  - la app sigue cargando datos desde `localStorage`,
  - pero lo hace en fase cliente tras el montaje.
- No cambia el contrato de APIs ni el modelo de datos persistido.

