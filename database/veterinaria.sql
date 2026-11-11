-- Fuente: mensaje de IRVIN ARLIN CHAN AC en Teams.
-- Publicado el 3 de noviembre de 2026 a las 7:35.
-- Se normalizaron los espacios y la presentacion del SQL compartido.
-- Ejecutar una sola vez en una instancia donde no exista veterinaria_db.

CREATE DATABASE veterinaria_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE veterinaria_db;

CREATE TABLE citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mascota VARCHAR(80) NOT NULL,
  cliente VARCHAR(120) NOT NULL,
  servicio VARCHAR(120) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('solicitada', 'confirmada', 'atendida', 'rechazada', 'cancelada')
    NOT NULL DEFAULT 'solicitada',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO citas (mascota, cliente, servicio, fecha, hora, estado)
VALUES
  ('Max', 'Ana López', 'Vacunación', '2026-10-28', '09:00:00', 'solicitada'),
  ('Voyka', 'Irvin Chan', 'Consulta Médica', '2026-10-28', '13:00:00', 'solicitada'),
  ('Firulais', 'Agapito Pacheco', 'Esterilizar', '2026-10-28', '15:00:00', 'solicitada'),
  ('Rocky', 'María Gómez', 'Desparasitar', '2026-10-28', '12:00:00', 'solicitada');

SELECT * FROM citas;
