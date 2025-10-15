<?php
/**
 * API de autenticación para Pourfect
 * Archivo: api/auth.php
 */

session_start();
require_once '../config/production.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

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
            
        case 'PUT':
            switch ($action) {
                case 'update':
                    updateProfile();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        default:
            jsonResponse(['status' => 'error', 'message' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    error_log("Error en auth.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Error interno del servidor'], 500);
}

/**
 * Función para enviar respuesta JSON
 */
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
    exit();
}

/**
 * Manejar login
 */
function handleLogin() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
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
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
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
    
    global $pdo;
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
        global $pdo;
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

/**
 * Actualizar perfil
 */
function updateProfile() {
    if (!isAuthenticated()) {
        jsonResponse(['status' => 'error', 'message' => 'No autenticado'], 401);
    }
    
    global $pdo;
    $userId = getCurrentUserId();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar entrada
    $rules = [
        'usuario' => ['required' => true, 'min_length' => 3, 'max_length' => 20, 'pattern' => '/^[a-zA-Z0-9_]+$/'],
        'bio' => ['required' => false, 'max_length' => 100],
        'email' => ['required' => false, 'max_length' => 100, 'pattern' => '/^[^\s@]+@[^\s@]+\.[^\s@]+$/']
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'message' => 'Datos inválidos', 'errors' => $errors], 400);
    }
    
    $usuario = sanitizeInput($input['usuario']);
    $bio = isset($input['bio']) ? sanitizeInput($input['bio']) : '';
    $email = isset($input['email']) ? sanitizeInput($input['email']) : null;
    
    // Verificar si el usuario ya existe (excluyendo el actual)
    $checkSql = "SELECT id FROM usuarios WHERE usuario = ? AND id != ?";
    if (fetchOne($pdo, $checkSql, [$usuario, $userId])) {
        jsonResponse(['status' => 'error', 'message' => 'El nombre de usuario ya existe'], 409);
    }
    
    // Verificar email si se proporciona
    if ($email) {
        $checkEmailSql = "SELECT id FROM usuarios WHERE email = ? AND id != ?";
        if (fetchOne($pdo, $checkEmailSql, [$email, $userId])) {
            jsonResponse(['status' => 'error', 'message' => 'El email ya está registrado'], 409);
        }
    }
    
    // Actualizar usuario
    $updateSql = "UPDATE usuarios SET usuario = ?, bio = ?, email = ? WHERE id = ?";
    executeQuery($pdo, $updateSql, [$usuario, $bio, $email, $userId]);
    
    // Actualizar sesión
    $_SESSION['usuario'] = $usuario;
    
    jsonResponse([
        'status' => 'success',
        'message' => 'Perfil actualizado exitosamente'
    ]);
}
?>


