# 13 - Traducción automática de sinopsis al idioma del título

## Contexto

Las sinopsis obtenidas de OpenLibrary están principalmente en inglés, pero los usuarios prefieren leerlas en el idioma del título del libro.

## Solución implementada

1. **Detección de idioma**: Usar la librería `franc` para detectar el idioma del título del libro.

2. **Traducción automática**: Integrar LibreTranslate (API gratuita) para traducir la sinopsis al idioma detectado.

3. **Aplicación en endpoints**:
   - `/api/libros/sinopsis`: Traduce la sinopsis antes de devolverla.
   - `/api/libros/search`: Traduce la sinopsis en los datos del libro encontrado.

## Dependencias añadidas

- `franc`: Para detección de idioma.
- `iso-639-3`: Para conversión de códigos de idioma.

## Impacto

- Las sinopsis ahora se muestran en el idioma del título, mejorando la experiencia de usuario.
- Fallback a inglés si la traducción falla o el idioma es indeterminado.
- Mantiene la resiliencia con timeouts y manejo de errores.</content>
<parameter name="filePath">c:\Users\chris\Desktop\RepoPrueba\docs\13-traduccion-automatica-sinopsis.md