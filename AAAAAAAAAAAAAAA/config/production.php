<?php
/**
 * CONFIGURACIÓN DE PRODUCCIÓN - POURFECT
 * Archivo: config/production.php
 * Versión: 1.0.0
 * Última actualización: 2024
 */

// ========================================
// CONFIGURACIÓN DE ERRORES PARA PRODUCCIÓN
// ========================================
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// ========================================
// CONFIGURACIÓN DE BASE DE DATOS
// ========================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'u157683007_pourfect');
define('DB_USER', 'u157683007_octash');
define('DB_PASS', 'Gaelyyael11');
define('DB_CHARSET', 'utf8mb4');

// ========================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ========================================
define('APP_NAME', 'Pourfect');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'production');
define('APP_URL', 'https://pourfect.ezsoft.com.ar');

// ========================================
// CONFIGURACIÓN DE SESIONES
// ========================================
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.gc_maxlifetime', 3600); // 1 hora

// ========================================
// HEADERS DE SEGURIDAD
// ========================================
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ========================================
// CONFIGURACIÓN CORS
// ========================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ========================================
// CONEXIÓN A BASE DE DATOS OPTIMIZADA
// ========================================
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
                PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
                PDO::MYSQL_ATTR_FOUND_ROWS => true
            ]);
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            return null;
        }
    }
    
    return $pdo;
}

// ========================================
// FUNCIONES DE RESPUESTA OPTIMIZADAS
// ========================================
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
    exit();
}

function sendError($message, $status = 400) {
    error_log("Error en API: " . $message);
    sendResponse([
        'status' => 'error',
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ], $status);
}

function sendSuccess($data = null, $message = 'Success') {
    $response = [
        'status' => 'success',
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    sendResponse($response);
}

// ========================================
// FUNCIONES DE VALIDACIÓN
// ========================================
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

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================
function formatDate($date, $format = 'd/m/Y H:i') {
    return date($format, strtotime($date));
}

function generateSlug($text) {
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    return trim($text, '-');
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ========================================
// CONFIGURACIÓN DE MIGUEL
// ========================================
define('MIGUEL_ENABLED', true);
define('MIGUEL_SHOW_INTERVAL', 15000); // 15 segundos
define('MIGUEL_HIDE_DELAY', 5000); // 5 segundos
define('MIGUEL_IMAGE_CHANGE_INTERVAL', 3000); // 3 segundos

// ========================================
// CONFIGURACIÓN DE CACHE
// ========================================
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 3600); // 1 hora
define('CACHE_DIR', __DIR__ . '/../cache');

// ========================================
// CONFIGURACIÓN DE LOGS
// ========================================
define('LOG_ENABLED', true);
define('LOG_DIR', __DIR__ . '/../logs');
define('LOG_MAX_SIZE', 10485760); // 10MB

// Crear directorios necesarios
$directories = [LOG_DIR, CACHE_DIR];
foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================
session_start();

// Limpiar cache antiguo
if (CACHE_ENABLED && is_dir(CACHE_DIR)) {
    $files = glob(CACHE_DIR . '/*.cache');
    foreach ($files as $file) {
        if (time() - filemtime($file) > CACHE_DURATION) {
            unlink($file);
        }
    }
}

// Limpiar logs antiguos
if (LOG_ENABLED && is_dir(LOG_DIR)) {
    $files = glob(LOG_DIR . '/*.log');
    foreach ($files as $file) {
        if (filesize($file) > LOG_MAX_SIZE) {
            file_put_contents($file, '');
        }
    }
}

?>