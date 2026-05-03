# Ajuste de contraste en tipografía

## Objetivo

Corregir el problema visual de textos demasiado claros para mejorar legibilidad y contraste.

## Cambios realizados

### 1) Color base global de texto

- Se actualizó el color de texto global (`--foreground`) a un tono negro grisáceo oscuro (`#1f2937`).
- Se eliminó la sobrescritura automática por `prefers-color-scheme: dark` para evitar que el sistema operativo fuerce texto claro sobre fondo blanco.

Archivo afectado:

- `app/globals.css`

### 2) Refuerzo de contraste en textos de la pantalla principal

- Se oscurecieron textos secundarios y de soporte en la UI de libros:
  - `text-zinc-500` -> `text-zinc-700`
  - `text-zinc-600` -> `text-zinc-800`
  - `text-zinc-700` -> `text-zinc-800` en sinopsis

Archivo afectado:

- `components/books/BooksApp.tsx`

## Impacto

- Mejor legibilidad general en títulos, metadatos y mensajes secundarios.
- Mayor consistencia visual con fondo blanco.
- Se evita el efecto de “texto lavado” en equipos con tema oscuro del sistema.

## Nota técnica

- El warning de lint sobre `@theme` en CSS ya existía y no está relacionado con este ajuste de contraste.
