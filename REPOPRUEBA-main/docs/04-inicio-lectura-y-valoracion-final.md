# Bloque funcional - Inicio de lectura y valoracion al finalizar

## Cambios implementados

1. Se agrega `fecha_inicio_lectura` al modelo SQL de `books`.
2. El formulario de alta permite indicar la fecha en la que se inicia la lectura.
3. La interfaz muestra inicio y fin de lectura por cada libro.
4. La valoracion en estrellas solo se habilita si el libro esta en estado `LEIDO`.
5. La API valida que no se pueda valorar un libro pendiente.
6. Se aplica un fondo con tonalidades de verde en la pantalla principal.

## Nota de evolucion

Queda preparada la base para ampliar en el futuro una vista de edicion completa al finalizar la lectura (notas finales, edicion de datos y valoracion final).
