# Bloque tecnico - Configuracion de entorno PostgreSQL

## Problema

Si `DATABASE_URL` no esta definida, la app falla al iniciar con error de validacion.

## Solucion

1. Copiar `.env.example` a `.env.local`.
2. Ajustar el valor real de `DATABASE_URL`.

Ejemplo:

`DATABASE_URL="postgresql://usuario:password@localhost:5432/biblioteca"`

## Nota

Despues de crear o cambiar `.env.local`, reinicia `npm run dev`.
