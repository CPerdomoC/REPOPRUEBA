CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  sinopsis TEXT,
  fecha_lanzamiento DATE,
  pais_origen TEXT,
  fecha_inicio_lectura DATE,
  valoracion SMALLINT CHECK (valoracion BETWEEN 1 AND 5),
  estado TEXT NOT NULL CHECK (estado IN ('PENDIENTE', 'LEIDO')),
  fecha_lectura DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS books_estado_idx ON books (estado);

INSERT INTO books (titulo, autor, sinopsis, fecha_lanzamiento, pais_origen, fecha_inicio_lectura, valoracion, estado)
VALUES
  (
    'Normal People',
    'Sally Rooney',
    'Marianne y Connell construyen una relacion intensa y cambiante desde la adolescencia hasta la adultez temprana.',
    '2018-08-28',
    'Irlanda',
    null,
    5,
    'PENDIENTE'
  ),
  (
    'Intermezzo',
    'Sally Rooney',
    'Dos hermanos enfrentan duelo, deseo y culpa mientras intentan sostener vinculos personales y familiares.',
    '2024-09-24',
    'Irlanda',
    null,
    4,
    'PENDIENTE'
  ),
  (
    'Don Quijote de la Mancha',
    'Miguel de Cervantes',
    'Un hidalgo obsesionado con los libros de caballeria sale al mundo con su escudero y confunde ficcion con realidad.',
    '1605-01-16',
    'Espana',
    null,
    5,
    'PENDIENTE'
  ),
  (
    '1984',
    'George Orwell',
    'En un estado totalitario, Winston Smith intenta conservar su pensamiento propio frente al control absoluto.',
    '1949-06-08',
    'Reino Unido',
    null,
    5,
    'PENDIENTE'
  ),
  (
    'La metamorfosis',
    'Franz Kafka',
    'Gregor Samsa despierta convertido en insecto y su transformacion revela el deterioro de su entorno familiar.',
    '1915-10-01',
    'Austria-Hungria',
    null,
    4,
    'PENDIENTE'
  )
ON CONFLICT DO NOTHING;
