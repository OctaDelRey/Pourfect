<?php
/**
 * Configuración unificada para Pourfect
 * Archivo: config/config.php
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'u157683007_pourfect');
define('DB_USER', 'u157683007_octash');
define('DB_PASS', 'Gaelyyael11');
define('DB_CHARSET', 'utf8mb4');

// Configuración de la aplicación
define('APP_NAME', 'Pourfect');
define('APP_VERSION', '1.0.0');
define('JWT_SECRET', 'pourfect_secret_key_2024');

// Configuración de sesiones
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Cambiar a 1 en producción con HTTPS

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

// Crear conexión global
$pdo = getDBConnection();

/**
 * Función para ejecutar consultas
 */
function executeQuery($pdo, $sql, $params = []) {
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Error en consulta: " . $e->getMessage());
        throw $e;
    }
}

/**
 * Función para obtener un registro
 */
function fetchOne($pdo, $sql, $params = []) {
    $stmt = executeQuery($pdo, $sql, $params);
    return $stmt->fetch();
}

/**
 * Función para obtener múltiples registros
 */
function fetchAll($pdo, $sql, $params = []) {
    $stmt = executeQuery($pdo, $sql, $params);
    return $stmt->fetchAll();
}

/**
 * Función para insertar y obtener ID
 */
function insertAndGetId($pdo, $sql, $params = []) {
    executeQuery($pdo, $sql, $params);
    return $pdo->lastInsertId();
}

/**
 * Función para enviar respuesta JSON
 */
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Función para validar entrada
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
 * Función para sanitizar entrada
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Función para verificar autenticación
 */
function isAuthenticated() {
    return isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id']);
}

/**
 * Función para obtener ID del usuario actual
 */
function getCurrentUserId() {
    return $_SESSION['usuario_id'] ?? null;
}

/**
 * Función para manejar errores
 */
function handleError($message, $status = 400) {
    jsonResponse([
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

/**
 * Función para buscar usuarios
 */
function searchUsers($query) {
    global $pdo;
    
    try {
        $sql = "SELECT u.id, u.usuario, u.bio, u.foto, u.fecha_registro,
                       COUNT(DISTINCT t.id) as total_tragos,
                       COUNT(DISTINCT f.id) as total_favoritos,
                       COALESCE(AVG(c.calificacion), 0) as promedio_calificaciones
                FROM usuarios u
                LEFT JOIN tragos t ON u.id = t.usuario_id AND t.activo = 1
                LEFT JOIN favoritos f ON u.id = f.usuario_id
                LEFT JOIN calificaciones c ON u.id = c.usuario_id
                WHERE u.activo = 1 AND (u.usuario LIKE ? OR u.bio LIKE ?)
                GROUP BY u.id, u.usuario, u.bio, u.foto, u.fecha_registro
                ORDER BY u.fecha_registro DESC";
        
        $searchTerm = "%$query%";
        $users = fetchAll($pdo, $sql, [$searchTerm, $searchTerm]);
        
        // Obtener tragos de cada usuario
        foreach ($users as &$user) {
            $tragosSql = "SELECT nombre FROM tragos WHERE usuario_id = ? AND activo = 1 LIMIT 5";
            $tragos = fetchAll($pdo, $tragosSql, [$user['id']]);
            $user['tragos'] = array_column($tragos, 'nombre');
        }
        
        return $users;
    } catch (Exception $e) {
        error_log("Error en searchUsers: " . $e->getMessage());
        return [];
    }
}
?>
