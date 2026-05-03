# Bloque funcional - Modo local sin PostgreSQL

## Objetivo

Permitir usar la app en local sin instalar Docker ni PostgreSQL.

## Cambios

1. `app/page.tsx` pasa a modo cliente y ya no consulta repositorio de base de datos.
2. `components/books/BooksApp.tsx` ahora:
   - guarda libros en `localStorage`
   - calcula resumen (`total`, `leidos`, `pendientes`) en cliente
   - mantiene altas, cambios de estado, valoracion y eliminacion sin API externa
3. Se mantiene la misma experiencia de uso para lectura y valoracion.

## Nota

Los datos quedan guardados en el navegador del dispositivo actual.
