<?php
/**
 * API de autenticación standalone para Pourfect
 * Archivo: api/auth-standalone.php
 * Versión que no depende de archivos externos
 */

// Configuración directa de base de datos
$host = '193.203.175.157';
$dbname = 'u157683007_pourfect';
$username = 'u157683007_octash';
$password = 'Gaelyyael11';
$charset = 'utf8mb4';

// Headers para API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Iniciar sesión
session_start();


// Función para conectar a la base de datos
function getDBConnection() {
    global $host, $dbname, $username, $password, $charset;
    
    try {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        $pdo = new PDO($dsn, $username, $password, [
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

// Función para validar entrada
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

// Función para sanitizar entrada
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Función para verificar autenticación
function isAuthenticated() {
    return isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id']);
}

// Función para obtener ID del usuario actual
function getCurrentUserId() {
    return $_SESSION['usuario_id'] ?? null;
}

// Función para ejecutar consultas
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

// Función para obtener un registro
function fetchOne($pdo, $sql, $params = []) {
    $stmt = executeQuery($pdo, $sql, $params);
    return $stmt->fetch();
}

// Función para insertar y obtener ID
function insertAndGetId($pdo, $sql, $params = []) {
    executeQuery($pdo, $sql, $params);
    return $pdo->lastInsertId();
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'POST':
            switch ($action) {
                case 'login':
                    handleLogin();
                    break;
                case 'register':
                    handleRegister();
                    break;
                case 'logout':
                    handleLogout();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        case 'GET':
            switch ($action) {
                case 'profile':
                    getProfile();
                    break;
                case 'check':
                    checkAuth();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        default:
            jsonResponse(['status' => 'error', 'message' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    error_log("Error en auth-standalone.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Error interno del servidor: ' . $e->getMessage()], 500);
}

/**
 * Manejar login
 */
function handleLogin() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['status' => 'error', 'message' => 'Error de conexión a la base de datos'], 500);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        jsonResponse(['status' => 'error', 'message' => 'Datos JSON inválidos'], 400);
    }
    
    // Validar entrada
    $rules = [
        'usuario' => ['required' => true, 'min_length' => 3, 'max_length' => 20, 'pattern' => '/^[a-zA-Z0-9_]+$/'],
        'password' => ['required' => true, 'min_length' => 4, 'max_length' => 50]
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'message' => 'Datos inválidos', 'errors' => $errors], 400);
    }
    
    $usuario = sanitizeInput($input['usuario']);
    $password = $input['password'];
    
    // Buscar usuario
    $sql = "SELECT id, usuario, password_hash, foto, bio, activo FROM usuarios WHERE usuario = ? AND activo = 1";
    $user = fetchOne($pdo, $sql, [$usuario]);
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['status' => 'error', 'message' => 'Credenciales inválidas'], 401);
    }
    
    // Actualizar último acceso
    $updateSql = "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?";
    executeQuery($pdo, $updateSql, [$user['id']]);
    
    // Crear sesión
    $_SESSION['usuario_id'] = $user['id'];
    $_SESSION['usuario'] = $user['usuario'];
    
    // Respuesta exitosa
    jsonResponse([
        'status' => 'success',
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user['id'],
            'usuario' => $user['usuario'],
            'foto' => $user['foto'],
            'bio' => $user['bio']
        ]
    ]);
}

/**
 * Manejar registro
 */
function handleRegister() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['status' => 'error', 'message' => 'Error de conexión a la base de datos'], 500);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        jsonResponse(['status' => 'error', 'message' => 'Datos JSON inválidos'], 400);
    }
    
    // Validar entrada
    $rules = [
        'usuario' => ['required' => true, 'min_length' => 3, 'max_length' => 20, 'pattern' => '/^[a-zA-Z0-9_]+$/'],
        'password' => ['required' => true, 'min_length' => 4, 'max_length' => 50],
        'email' => ['required' => false, 'max_length' => 100, 'pattern' => '/^[^\s@]+@[^\s@]+\.[^\s@]+$/']
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'message' => 'Datos inválidos', 'errors' => $errors], 400);
    }
    
    $usuario = sanitizeInput($input['usuario']);
    $password = $input['password'];
    $email = isset($input['email']) ? sanitizeInput($input['email']) : null;
    
    // Verificar que la contraseña no sea igual al usuario
    if ($password === $usuario) {
        jsonResponse(['status' => 'error', 'message' => 'La contraseña no puede ser igual al nombre de usuario'], 400);
    }
    
    // Verificar si el usuario ya existe
    $checkSql = "SELECT id FROM usuarios WHERE usuario = ?";
    if (fetchOne($pdo, $checkSql, [$usuario])) {
        jsonResponse(['status' => 'error', 'message' => 'El nombre de usuario ya existe'], 409);
    }
    
    // Verificar email si se proporciona
    if ($email) {
        $checkEmailSql = "SELECT id FROM usuarios WHERE email = ?";
        if (fetchOne($pdo, $checkEmailSql, [$email])) {
            jsonResponse(['status' => 'error', 'message' => 'El email ya está registrado'], 409);
        }
    }
    
    // Crear hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar usuario
    $insertSql = "INSERT INTO usuarios (usuario, password_hash, email, bio) VALUES (?, ?, ?, ?)";
    $userId = insertAndGetId($pdo, $insertSql, [$usuario, $passwordHash, $email, 'Nuevo usuario de Pourfect']);
    
    // Crear sesión
    $_SESSION['usuario_id'] = $userId;
    $_SESSION['usuario'] = $usuario;
    
    // Respuesta exitosa
    jsonResponse([
        'status' => 'success',
        'message' => 'Usuario registrado exitosamente',
        'user' => [
            'id' => $userId,
            'usuario' => $usuario,
            'foto' => 'avatar.png',
            'bio' => 'Nuevo usuario de Pourfect'
        ]
    ]);
}

/**
 * Manejar logout
 */
function handleLogout() {
    // Destruir sesión
    session_destroy();
    
    jsonResponse([
        'status' => 'success',
        'message' => 'Sesión cerrada exitosamente'
    ]);
}

/**
 * Obtener perfil del usuario
 */
function getProfile() {
    if (!isAuthenticated()) {
        jsonResponse(['status' => 'error', 'message' => 'No autenticado'], 401);
    }
    
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['status' => 'error', 'message' => 'Error de conexión a la base de datos'], 500);
    }
    
    $userId = getCurrentUserId();
    
    $sql = "SELECT id, usuario, email, foto, bio, fecha_registro FROM usuarios WHERE id = ?";
    $user = fetchOne($pdo, $sql, [$userId]);
    
    if (!$user) {
        jsonResponse(['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
    }
    
    jsonResponse([
        'status' => 'success',
        'user' => $user
    ]);
}

/**
 * Verificar autenticación
 */
function checkAuth() {
    if (isAuthenticated()) {
        $pdo = getDBConnection();
        if (!$pdo) {
            jsonResponse(['status' => 'error', 'message' => 'Error de conexión a la base de datos'], 500);
        }
        
        $userId = getCurrentUserId();
        
        $sql = "SELECT id, usuario, foto, bio FROM usuarios WHERE id = ?";
        $user = fetchOne($pdo, $sql, [$userId]);
        
        jsonResponse([
            'status' => 'success',
            'authenticated' => true,
            'user' => $user
        ]);
    } else {
        jsonResponse([
            'status' => 'success',
            'authenticated' => false
        ]);
    }
}
?>
