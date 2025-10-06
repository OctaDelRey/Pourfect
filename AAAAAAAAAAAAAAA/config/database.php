<?php
/**
 * Configuración de base de datos para Hostinger
 * Archivo: config/database.php
 */

// Configuración para Hostinger
$host = 'localhost'; // Host de Hostinger
$dbname = 'u157683007_pourfect'; // Nombre de tu base de datos (con prefijo de usuario)
$username = 'u157683007_octash'; // Tu usuario de base de datos
$password = 'Gaelyyael11'; // Tu contraseña de base de datos
$charset = 'utf8mb4';

// Configuración de opciones PDO
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE  => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
];

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // Configurar zona horaria
    $pdo->exec("SET time_zone = '+00:00'");
    
} catch (PDOException $e) {
    // Log del error (en producción, no mostrar detalles)
    error_log("Error de conexión a la base de datos: " . $e->getMessage());
    
    // Respuesta segura para el cliente
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de conexión a la base de datos'
    ]);
    exit;
}

// Función helper para ejecutar consultas preparadas
function executeQuery($pdo, $sql, $params = []) {
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Error en consulta SQL: " . $e->getMessage());
        throw $e;
    }
}

// Función helper para obtener un solo resultado
function fetchOne($pdo, $sql, $params = []) {
    $stmt = executeQuery($pdo, $sql, $params);
    return $stmt->fetch();
}

// Función helper para obtener múltiples resultados
function fetchAll($pdo, $sql, $params = []) {
    $stmt = executeQuery($pdo, $sql, $params);
    return $stmt->fetchAll();
}

// Función helper para insertar y obtener el ID
function insertAndGetId($pdo, $sql, $params = []) {
    $stmt = executeQuery($pdo, $sql, $params);
    return $pdo->lastInsertId();
}

// Función para validar entrada
function validateInput($data, $rules) {
    $errors = [];
    
    foreach ($rules as $field => $rule) {
        $value = $data[$field] ?? '';
        
        // Validar requerido
        if (isset($rule['required']) && $rule['required'] && empty($value)) {
            $errors[$field] = "El campo $field es obligatorio";
            continue;
        }
        
        // Validar longitud mínima
        if (isset($rule['min_length']) && strlen($value) < $rule['min_length']) {
            $errors[$field] = "El campo $field debe tener al menos {$rule['min_length']} caracteres";
        }
        
        // Validar longitud máxima
        if (isset($rule['max_length']) && strlen($value) > $rule['max_length']) {
            $errors[$field] = "El campo $field no puede tener más de {$rule['max_length']} caracteres";
        }
        
        // Validar patrón
        if (isset($rule['pattern']) && !preg_match($rule['pattern'], $value)) {
            $errors[$field] = "El campo $field tiene un formato inválido";
        }
    }
    
    return $errors;
}

// Función para generar respuesta JSON
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Función para sanitizar entrada
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id']);
}

// Función para obtener el ID del usuario actual
function getCurrentUserId() {
    return $_SESSION['usuario_id'] ?? null;
}

// Función para verificar permisos
function hasPermission($permission) {
    if (!isAuthenticated()) {
        return false;
    }
    
    // Aquí puedes implementar lógica de permisos más compleja
    return true;
}

// Configurar headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Configurar CORS si es necesario
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
