<?php
/**
 * API de gestión de usuarios para Pourfect
 * Archivo: api/users.php
 */

session_start();
require_once '../config/production.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Headers para API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    switch ($method) {
        case 'GET':
            switch ($action) {
                case 'search':
                    searchUsers();
                    break;
                case 'profile':
                    getUserProfile();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        default:
            jsonResponse(['status' => 'error', 'message' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    error_log("Error en users.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Error interno del servidor'], 500);
}

/**
 * Buscar usuarios
 */
function searchUsers() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['status' => 'error', 'message' => 'Error de conexión a la base de datos'], 500);
    }
    
    $query = $_GET['query'] ?? '';
    
    if (empty($query)) {
        jsonResponse(['status' => 'error', 'message' => 'Término de búsqueda requerido'], 400);
    }
    
    $searchTerm = "%$query%";
    
    $sql = "SELECT u.id, u.usuario, u.foto, u.bio, u.fecha_registro,
                   COUNT(t.id) as total_tragos,
                   AVG(c.calificacion) as promedio_calificacion
            FROM usuarios u
            LEFT JOIN tragos t ON u.id = t.usuario_id AND t.eliminado = 0
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE u.usuario LIKE ? AND u.activo = 1
            GROUP BY u.id
            ORDER BY u.usuario ASC
            LIMIT 20";
    
    $users = fetchAll($pdo, $sql, [$searchTerm]);
    
    // Procesar resultados
    foreach ($users as &$user) {
        $user['total_tragos'] = intval($user['total_tragos']);
        $user['promedio_calificacion'] = $user['promedio_calificacion'] ? round($user['promedio_calificacion'], 1) : 0;
    }
    
    jsonResponse([
        'status' => 'success',
        'users' => $users
    ]);
}

/**
 * Obtener perfil de usuario
 */
function getUserProfile() {
    $pdo = getDBConnection();
    if (!$pdo) {
        jsonResponse(['status' => 'error', 'message' => 'Error de conexión a la base de datos'], 500);
    }
    
    $userId = intval($_GET['id'] ?? 0);
    
    if (!$userId) {
        jsonResponse(['status' => 'error', 'message' => 'ID de usuario requerido'], 400);
    }
    
    // Obtener información del usuario
    $userSql = "SELECT id, usuario, foto, bio, fecha_registro FROM usuarios WHERE id = ? AND activo = 1";
    $user = fetchOne($pdo, $userSql, [$userId]);
    
    if (!$user) {
        jsonResponse(['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
    }
    
    // Obtener tragos creados por el usuario
    $drinksSql = "SELECT t.id, t.nombre, t.descripcion, t.tipo, t.imagen, t.fecha_creacion,
                         AVG(c.calificacion) as promedio_calificacion,
                         COUNT(c.id) as total_calificaciones
                  FROM tragos t
                  LEFT JOIN calificaciones c ON t.id = c.trago_id
                  WHERE t.usuario_id = ? AND t.eliminado = 0
                  GROUP BY t.id
                  ORDER BY t.fecha_creacion DESC";
    
    $drinks = fetchAll($pdo, $drinksSql, [$userId]);
    
    // Procesar tragos
    foreach ($drinks as &$drink) {
        $drink['promedio_calificacion'] = $drink['promedio_calificacion'] ? round($drink['promedio_calificacion'], 1) : 0;
        $drink['total_calificaciones'] = intval($drink['total_calificaciones']);
    }
    
    jsonResponse([
        'status' => 'success',
        'user' => $user,
        'drinks' => $drinks
    ]);
}
?>
