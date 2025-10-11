<?php
/**
 * Configuración de la base de datos para Pourfect
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'pourfect_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuración de la aplicación
define('APP_NAME', 'Pourfect');
define('APP_VERSION', '1.0.0');
define('JWT_SECRET', 'pourfect_secret_key_2024');

// Configuración CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Función para conectar a la base de datos
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Error de conexión a la base de datos: " . $e->getMessage());
        return null;
    }
}

/**
 * Función para enviar respuesta JSON
 */
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Función para manejar errores
 */
function handleError($message, $status = 400) {
    sendResponse([
        'success' => false,
        'error' => $message
    ], $status);
}

/**
 * Función para validar token JWT (simplificada)
 */
function validateToken($token) {
    // En una implementación real, aquí validarías el JWT
    // Por ahora, solo verificamos que el token existe
    return !empty($token);
}
?>
