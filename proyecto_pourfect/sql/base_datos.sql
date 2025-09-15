CREATE DATABASE IF NOT EXISTS pourfect;
USE pourfect;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE tragos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  tipo VARCHAR(50),
  imagen VARCHAR(100),
  descripcion TEXT
);

CREATE TABLE ingredientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trago_id INT,
  ingrediente VARCHAR(100),
  cantidad VARCHAR(50),
  FOREIGN KEY (trago_id) REFERENCES tragos(id)
);

CREATE TABLE puntuaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trago_id INT,
  usuario_id INT,
  estrellas INT CHECK(estrellas BETWEEN 1 AND 5),
  FOREIGN KEY (trago_id) REFERENCES tragos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
