-- Estructura de base de datos para Pourfect
-- Ejecutar en HeidiSQL después de conectar con las credenciales

USE u157683007_pourfect;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    foto VARCHAR(100) DEFAULT 'avatar.png',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario)
);

-- Tabla de tragos
CREATE TABLE IF NOT EXISTS tragos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('con-alcohol', 'sin-alcohol', 'postre', 'shot', 'tropical', 'clasico', 'trending') NOT NULL,
    imagen VARCHAR(100) NOT NULL,
    ingredientes TEXT,
    pasos TEXT,
    usuario_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    promedio_calificacion DECIMAL(3,2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_nombre (nombre),
    INDEX idx_tipo (tipo),
    INDEX idx_usuario_id (usuario_id)
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    trago_id INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (trago_id) REFERENCES tragos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, trago_id),
    INDEX idx_usuario_favoritos (usuario_id)
);

-- Tabla de calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    trago_id INT NOT NULL,
    calificacion TINYINT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (trago_id) REFERENCES tragos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_calificacion (usuario_id, trago_id),
    INDEX idx_trago_calificaciones (trago_id)
);

-- Insertar algunos usuarios de prueba
INSERT INTO usuarios (usuario, password_hash, bio, foto) VALUES
('mixologist_pro', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Especialista en cócteles clásicos', 'avatar.png'),
('bartender_creative', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Creador de cócteles innovadores', 'avatar.png'),
('cocktail_master', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maestro de la coctelería', 'avatar.png'),
('drink_explorer', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Explorador de sabores únicos', 'avatar.png');

-- Insertar algunos tragos de prueba
INSERT INTO tragos (nombre, descripcion, tipo, imagen, ingredientes, pasos, usuario_id, promedio_calificacion, total_calificaciones) VALUES
('Mojito Clásico', 'Refrescante cóctel cubano con menta y lima', 'clasico', 'mojito.jpg', 'Ron blanco, Menta fresca, Lima, Azúcar, Soda', '1. Macerar menta con azúcar\n2. Agregar hielo y ron\n3. Completar con soda', 1, 4.5, 25),
('Margarita Perfecta', 'Cóctel mexicano con tequila y lima', 'clasico', 'margarita.jpg', 'Tequila, Jugo de lima, Triple sec, Sal', '1. Mezclar ingredientes con hielo\n2. Servir en vaso con borde salado', 2, 4.2, 18),
('Martini Seco', 'Elegante cóctel con ginebra y vermut', 'clasico', 'martini.jpg', 'Ginebra, Vermut seco, Aceituna', '1. Mezclar con hielo\n2. Colar en copa fría', 3, 4.8, 32),
('Caipirinha Brasileña', 'Cóctel brasileño con cachaça', 'clasico', 'caipirinha.jpg', 'Cachaça, Lima, Azúcar morena', '1. Macerar lima con azúcar\n2. Agregar cachaça y hielo', 4, 4.3, 20),
('Limonada Fresca', 'Refrescante bebida sin alcohol', 'sin-alcohol', 'limonada.jpg', 'Limones, Azúcar, Agua, Menta', '1. Exprimir limones\n2. Mezclar con azúcar y agua\n3. Agregar hielo y menta', 1, 4.0, 15),
('Piña Colada', 'Cóctel tropical cremoso con ron, piña y coco', 'tropical', 'pcolada.jpg', 'Ron blanco, Jugo de piña, Crema de coco, Hielo', '1. Licuar todos los ingredientes\n2. Servir en vaso alto con hielo', 2, 4.1, 22),
('Espresso Martini', 'Clásico emergente con café y vodka', 'trending', 'espresso_martini.jpg', 'Vodka, Licor de café, Café espresso, Hielo', '1. Agitar todos los ingredientes\n2. Colar en copa de cóctel', 3, 4.6, 28),
('Baileys con Helado', 'Suave, cremoso y delicioso, ideal para el postre', 'postre', 'baileys_helado.jpg', 'Baileys, Helado de vainilla, Hielo', '1. Colocar helado en vaso\n2. Verter Baileys encima\n3. Servir inmediatamente', 1, 4.3, 16),
('Baby Guinness', 'Trago corto con efecto visual de mini pinta', 'shot', 'baby_guinness.jpg', 'Licor de café, Baileys', '1. Servir licor de café\n2. Flotar Baileys encima', 4, 4.0, 12);

-- Insertar algunas calificaciones de prueba
INSERT INTO calificaciones (usuario_id, trago_id, calificacion) VALUES
(1, 1, 5), (1, 2, 4), (1, 3, 5), (1, 6, 4), (1, 7, 5),
(2, 1, 4), (2, 3, 5), (2, 4, 4), (2, 6, 5), (2, 8, 4),
(3, 2, 5), (3, 4, 4), (3, 5, 3), (3, 7, 5), (3, 9, 4),
(4, 1, 5), (4, 2, 4), (4, 3, 5), (4, 6, 4), (4, 8, 5);

-- Insertar algunos favoritos de prueba
INSERT INTO favoritos (usuario_id, trago_id) VALUES
(1, 1), (1, 3), (1, 5), (1, 7),
(2, 2), (2, 4), (2, 6), (2, 8),
(3, 1), (3, 3), (3, 7), (3, 9),
(4, 2), (4, 4), (4, 6), (4, 8);

-- Crear vista para búsqueda de usuarios con estadísticas
CREATE VIEW vista_usuarios_completa AS
SELECT 
    u.id,
    u.usuario,
    u.bio,
    u.foto,
    u.fecha_registro,
    COUNT(DISTINCT t.id) as total_tragos,
    COUNT(DISTINCT f.id) as total_favoritos,
    COALESCE(AVG(c.calificacion), 0) as promedio_calificaciones
FROM usuarios u
LEFT JOIN tragos t ON u.id = t.usuario_id
LEFT JOIN favoritos f ON u.id = f.usuario_id
LEFT JOIN calificaciones c ON u.id = c.usuario_id
GROUP BY u.id, u.usuario, u.bio, u.foto, u.fecha_registro;

-- Crear vista para tragos con información del creador
CREATE VIEW vista_tragos_completa AS
SELECT 
    t.id,
    t.nombre,
    t.descripcion,
    t.tipo,
    t.imagen,
    t.ingredientes,
    t.pasos,
    t.promedio_calificacion,
    t.total_calificaciones,
    u.usuario as creador,
    u.foto as foto_creador
FROM tragos t
LEFT JOIN usuarios u ON t.usuario_id = u.id;


