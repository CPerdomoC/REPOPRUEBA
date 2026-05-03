# Bloque tecnico - Limpieza de warnings en desarrollo

## Problema reportado

En el arranque de `next dev` aparecian warnings del navegador:

- Imagen con posible distorsion de proporcion (`vercel.svg`).
- Recursos preloaded sin uso inmediato (`next.svg` y fuentes).

## Causa

La plantilla inicial de Next.js incluia recursos de demo (logos y enlaces) que no forman parte de la app final. Ademas, se estaba cargando la fuente Geist pero el `body` usaba Arial, lo que provocaba preloads no utilizados.

## Cambios aplicados

1. `app/page.tsx`
   - Se elimino contenido demo de Create Next App.
   - Se removieron imagenes y enlaces de ejemplo.
   - Se dejo una pantalla inicial limpia para la app de biblioteca.

2. `app/globals.css`
   - Se ajusto `font-family` para usar `var(--font-geist-sans)` como fuente principal.

## Impacto

- Se eliminan los warnings de recursos de plantilla no usados.
- La base visual queda alineada con la app real que estamos construyendo.
