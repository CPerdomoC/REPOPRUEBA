## Biblioteca personal (Next.js + PostgreSQL)

Aplicacion para gestionar libros leidos/pendientes con valoracion por estrellas.

## Configuracion de entorno

1. Copia `.env.example` a `.env.local`.
2. Configura `DATABASE_URL` con tu base de datos PostgreSQL.
3. Ejecuta el script `basedatos/001_init_books.sql`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Funcionalidades actuales

- Alta de libros con metadatos (sinopsis, pais, fechas).
- Conteo de libros leidos y pendientes.
- Cambio de estado (`PENDIENTE` / `LEIDO`).
- Valoracion por estrellas al finalizar lectura.
- Eliminacion de libros.

## Documentacion del proyecto

- `docs/00-setup-inicial.md`
- `docs/01-bloque-basedatos-dominio.md`
- `docs/02-fix-warnings-consola.md`
- `docs/03-api-y-ui-funcional.md`
- `docs/04-inicio-lectura-y-valoracion-final.md`
- `docs/05-configuracion-entorno.md`
