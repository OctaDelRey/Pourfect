-- Estructura de base de datos para Pourfect
-- Para MariaDB en Hostinger

-- Crear base de datos (ya existe en Hostinger)
-- CREATE DATABASE IF NOT EXISTS u157683007_pourfect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE u157683007_pourfect;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    foto VARCHAR(100) DEFAULT 'avatar.png',
    bio TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_usuario (usuario),
    INDEX idx_email (email)
);

-- Tabla de tragos
CREATE TABLE tragos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('con-alcohol', 'sin-alcohol') NOT NULL,
    imagen VARCHAR(100) NOT NULL,
    ingredientes JSON,
    pasos JSON,
    usuario_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_nombre (nombre),
    INDEX idx_tipo (tipo),
    INDEX idx_usuario (usuario_id)
);

-- Tabla de favoritos
CREATE TABLE favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    trago_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (trago_id) REFERENCES tragos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, trago_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_trago (trago_id)
);

-- Tabla de calificaciones
CREATE TABLE calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    trago_id INT NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (trago_id) REFERENCES tragos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_calificacion (usuario_id, trago_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_trago (trago_id)
);

-- Insertar tragos por defecto
INSERT INTO tragos (nombre, descripcion, tipo, imagen, ingredientes, pasos) VALUES
('Mojito', 'Cóctel cubano refrescante con ron blanco, menta, lima y soda', 'con-alcohol', 'mojito.jpg', 
 '["2 oz Ron blanco", "8-10 hojas de menta fresca", "1/2 lima", "2 cucharaditas de azúcar", "Soda water", "Hielo"]',
 '["Macera la menta con el azúcar en el fondo del vaso", "Agrega el jugo de lima", "Llena el vaso con hielo", "Vierte el ron", "Completa con soda water", "Decora con menta fresca"]'),

('Piña Colada', 'Cóctel tropical cremoso con ron, piña y coco', 'con-alcohol', 'pcolada.jpg',
 '["2 oz Ron blanco", "3 oz Jugo de piña", "1 oz Crema de coco", "1/2 oz Jugo de lima", "Hielo"]',
 '["Combina todos los ingredientes en una coctelera", "Agita vigorosamente con hielo", "Cuela en un vaso alto con hielo", "Decora con piña y cereza"]'),

('Margarita', 'Cóctel mexicano clásico con tequila, lima y triple sec', 'con-alcohol', 'margarita.jpg',
 '["2 oz Tequila blanco", "1 oz Triple sec", "1 oz Jugo de lima fresco", "Sal para el borde", "Hielo"]',
 '["Prepara el borde del vaso con sal", "Combina ingredientes en coctelera con hielo", "Agita bien", "Cuela en vaso frío con hielo", "Decora con rodaja de lima"]'),

('Limonada', 'Bebida refrescante sin alcohol con limón y menta', 'sin-alcohol', 'limonada.jpg',
 '["4 limones frescos", "1/2 taza de azúcar", "4 tazas de agua", "Hojas de menta", "Hielo"]',
 '["Exprime el jugo de los limones", "Mezcla con azúcar hasta disolver", "Agrega agua y mezcla bien", "Añade hojas de menta", "Sirve con hielo y decora con limón"]'),

('Cosmopolitan', 'Cóctel elegante con vodka, arándanos y lima', 'con-alcohol', 'cosmopolitan.jpg',
 '["1.5 oz Vodka", "1 oz Triple sec", "1/2 oz Jugo de arándanos", "1/2 oz Jugo de lima", "Hielo"]',
 '["Combina todos los ingredientes en coctelera", "Agita con hielo", "Cuela en copa de cóctel fría", "Decora con rodaja de lima"]'),

('Caipirinha', 'Cóctel brasileño tradicional con cachaça y lima', 'con-alcohol', 'caipirinha.jpg',
 '["2 oz Cachaça", "1 lima cortada en cuartos", "2 cucharadas de azúcar", "Hielo"]',
 '["Macera la lima con azúcar en el vaso", "Agrega hielo hasta llenar", "Vierte la cachaça", "Mezcla suavemente", "Decora con rodaja de lima"]'),

('Daiquiri', 'Cóctel clásico cubano con ron, lima y azúcar', 'con-alcohol', 'daikiri.jpg',
 '["2 oz Ron blanco", "1 oz Jugo de lima fresco", "1/2 oz Azúcar", "Hielo"]',
 '["Combina todos los ingredientes en coctelera", "Agita vigorosamente con hielo", "Cuela en copa de cóctel fría", "Decora con rodaja de lima"]'),

('Martini', 'Cóctel elegante con ginebra y vermut seco', 'con-alcohol', 'martini.jpg',
 '["2.5 oz Ginebra", "0.5 oz Vermut seco", "Aceituna para decorar", "Hielo"]',
 '["Combina ginebra y vermut en coctelera", "Agita con hielo", "Cuela en copa de martini fría", "Decora con aceituna"]'),

('Negroni', 'Cóctel italiano clásico con ginebra, campari y vermut', 'con-alcohol', 'negroni.jpg',
 '["1 oz Ginebra", "1 oz Campari", "1 oz Vermut rojo", "Rodaja de naranja", "Hielo"]',
 '["Combina todos los ingredientes en vaso con hielo", "Remueve suavemente", "Decora con rodaja de naranja", "Sirve en vaso con hielo"]'),

('Sangría', 'Bebida española con vino tinto y frutas', 'con-alcohol', 'sangria.jpg',
 '["1 botella vino tinto", "1/4 taza brandy", "1/4 taza azúcar", "Frutas variadas", "Hielo"]',
 '["Corta frutas en trozos pequeños", "Mezcla vino, brandy y azúcar", "Agrega las frutas", "Refrigera por 2 horas", "Sirve con hielo"]'),

('Malibu', 'Cóctel tropical con ron de coco y piña', 'con-alcohol', 'malibu.jpg',
 '["2 oz Ron Malibu", "4 oz Jugo de piña", "1/2 oz Jugo de lima", "Hielo"]',
 '["Combina todos los ingredientes en vaso alto", "Agrega hielo", "Mezcla suavemente", "Decora con piña y cereza"]'),

('Campari', 'Aperitivo italiano amargo y refrescante', 'con-alcohol', 'campari.jpg',
 '["2 oz Campari", "4 oz Soda water", "Rodaja de naranja", "Hielo"]',
 '["Vierte Campari en vaso con hielo", "Completa con soda water", "Decora con rodaja de naranja", "Sirve inmediatamente"]');
