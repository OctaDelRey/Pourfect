<?php
/**
 * Configuración optimizada para producción - Pourfect
 * Archivo: config/production.php
 */

// Configuración de errores para producción
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Configuración de base de datos optimizada
define('DB_HOST', 'localhost');
define('DB_NAME', 'u157683007_pourfect');
define('DB_USER', 'u157683007_octash');
define('DB_PASS', 'Gaelyyael11');
define('DB_CHARSET', 'utf8mb4');

// Configuración de la aplicación
define('APP_NAME', 'Pourfect');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'production');

// Configuración de sesiones
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');

// Headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Configuración CORS optimizada
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
 * Función para conectar a la base de datos con optimizaciones
 */
function getDBConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => true,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
            ]);
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            return null;
        }
    }
    
    return $pdo;
}

/**
 * Función para enviar respuesta JSON optimizada
 */
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
    exit();
}

/**
 * Función para manejar errores de forma segura
 */
function handleError($message, $status = 400) {
    error_log("Error en API: " . $message);
    sendResponse([
        'status' => 'error',
        'message' => $message
    ], $status);
}

/**
 * Función para validar entrada de forma segura
 */
function validateInput($input, $rules) {
    $errors = [];
    
    foreach ($rules as $field => $rule) {
        $value = $input[$field] ?? '';
        
        if (isset($rule['required']) && $rule['required'] && empty($value)) {
            $errors[$field] = "El campo $field es requerido";
            continue;
        }
        
        if (!empty($value)) {
            if (isset($rule['min_length']) && strlen($value) < $rule['min_length']) {
                $errors[$field] = "El campo $field debe tener al menos {$rule['min_length']} caracteres";
            }
            
            if (isset($rule['max_length']) && strlen($value) > $rule['max_length']) {
                $errors[$field] = "El campo $field no puede tener más de {$rule['max_length']} caracteres";
            }
            
            if (isset($rule['pattern']) && !preg_match($rule['pattern'], $value)) {
                $errors[$field] = "El campo $field tiene un formato inválido";
            }
        }
    }
    
    return $errors;
}

/**
 * Función para sanitizar entrada de forma segura
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>
