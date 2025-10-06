<?php
/**
 * API de gestión de tragos para Pourfect
 * Archivo: api/drinks.php
 */

session_start();
require_once '../config/database.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Headers para API
header('Content-Type: application/json; charset=utf-8');

try {
    switch ($method) {
        case 'GET':
            switch ($action) {
                case 'list':
                    getDrinksList();
                    break;
                case 'detail':
                    getDrinkDetail();
                    break;
                case 'favorites':
                    getFavorites();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        case 'POST':
            switch ($action) {
                case 'add':
                    addDrink();
                    break;
                case 'favorite':
                    toggleFavorite();
                    break;
                case 'rate':
                    rateDrink();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        case 'PUT':
            switch ($action) {
                case 'update':
                    updateDrink();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        case 'DELETE':
            switch ($action) {
                case 'delete':
                    deleteDrink();
                    break;
                default:
                    jsonResponse(['status' => 'error', 'message' => 'Acción no válida'], 400);
            }
            break;
            
        default:
            jsonResponse(['status' => 'error', 'message' => 'Método no permitido'], 405);
    }
} catch (Exception $e) {
    error_log("Error en drinks.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Error interno del servidor'], 500);
}

/**
 * Obtener lista de tragos
 */
function getDrinksList() {
    global $pdo;
    
    $search = $_GET['search'] ?? '';
    $tipo = $_GET['tipo'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = 12;
    $offset = ($page - 1) * $limit;
    
    // Construir consulta
    $whereConditions = ['t.activo = 1'];
    $params = [];
    
    if (!empty($search)) {
        $whereConditions[] = 't.nombre LIKE ?';
        $params[] = "%$search%";
    }
    
    if (!empty($tipo) && in_array($tipo, ['con-alcohol', 'sin-alcohol'])) {
        $whereConditions[] = 't.tipo = ?';
        $params[] = $tipo;
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Consulta principal
    $sql = "SELECT t.id, t.nombre, t.descripcion, t.tipo, t.imagen, t.ingredientes, t.pasos,
                   t.usuario_id, u.usuario as creador,
                   AVG(c.puntuacion) as promedio_calificacion,
                   COUNT(c.id) as total_calificaciones
            FROM tragos t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE $whereClause
            GROUP BY t.id
            ORDER BY t.fecha_creacion DESC
            LIMIT $limit OFFSET $offset";
    
    $drinks = fetchAll($pdo, $sql, $params);
    
    // Contar total para paginación
    $countSql = "SELECT COUNT(*) as total FROM tragos t WHERE $whereClause";
    $total = fetchOne($pdo, $countSql, $params)['total'];
    
    // Procesar resultados
    foreach ($drinks as &$drink) {
        $drink['ingredientes'] = json_decode($drink['ingredientes'], true);
        $drink['pasos'] = json_decode($drink['pasos'], true);
        $drink['promedio_calificacion'] = round($drink['promedio_calificacion'], 1);
        $drink['total_calificaciones'] = intval($drink['total_calificaciones']);
    }
    
    jsonResponse([
        'status' => 'success',
        'drinks' => $drinks,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => intval($total),
            'pages' => ceil($total / $limit)
        ]
    ]);
}

/**
 * Obtener detalle de un trago
 */
function getDrinkDetail() {
    global $pdo;
    
    $drinkId = intval($_GET['id'] ?? 0);
    if (!$drinkId) {
        jsonResponse(['status' => 'error', 'message' => 'ID de trago requerido'], 400);
    }
    
    $sql = "SELECT t.*, u.usuario as creador,
                   AVG(c.puntuacion) as promedio_calificacion,
                   COUNT(c.id) as total_calificaciones
            FROM tragos t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE t.id = ? AND t.activo = 1
            GROUP BY t.id";
    
    $drink = fetchOne($pdo, $sql, [$drinkId]);
    
    if (!$drink) {
        jsonResponse(['status' => 'error', 'message' => 'Trago no encontrado'], 404);
    }
    
    // Procesar datos
    $drink['ingredientes'] = json_decode($drink['ingredientes'], true);
    $drink['pasos'] = json_decode($drink['pasos'], true);
    $drink['promedio_calificacion'] = round($drink['promedio_calificacion'], 1);
    $drink['total_calificaciones'] = intval($drink['total_calificaciones']);
    
    // Obtener calificación del usuario actual si está autenticado
    if (isAuthenticated()) {
        $userId = getCurrentUserId();
        $ratingSql = "SELECT puntuacion FROM calificaciones WHERE usuario_id = ? AND trago_id = ?";
        $userRating = fetchOne($pdo, $ratingSql, [$userId, $drinkId]);
        $drink['user_rating'] = $userRating ? intval($userRating['puntuacion']) : 0;
        
        // Verificar si es favorito
        $favoriteSql = "SELECT id FROM favoritos WHERE usuario_id = ? AND trago_id = ?";
        $isFavorite = fetchOne($pdo, $favoriteSql, [$userId, $drinkId]);
        $drink['is_favorite'] = !empty($isFavorite);
    } else {
        $drink['user_rating'] = 0;
        $drink['is_favorite'] = false;
    }
    
    jsonResponse([
        'status' => 'success',
        'drink' => $drink
    ]);
}

/**
 * Obtener favoritos del usuario
 */
function getFavorites() {
    if (!isAuthenticated()) {
        jsonResponse(['status' => 'error', 'message' => 'No autenticado'], 401);
    }
    
    global $pdo;
    $userId = getCurrentUserId();
    
    $sql = "SELECT t.id, t.nombre, t.descripcion, t.tipo, t.imagen, t.ingredientes, t.pasos,
                   t.usuario_id, u.usuario as creador,
                   AVG(c.puntuacion) as promedio_calificacion,
                   COUNT(c.id) as total_calificaciones,
                   f.fecha_agregado
            FROM favoritos f
            JOIN tragos t ON f.trago_id = t.id
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE f.usuario_id = ? AND t.activo = 1
            GROUP BY t.id
            ORDER BY f.fecha_agregado DESC";
    
    $favorites = fetchAll($pdo, $sql, [$userId]);
    
    // Procesar resultados
    foreach ($favorites as &$favorite) {
        $favorite['ingredientes'] = json_decode($favorite['ingredientes'], true);
        $favorite['pasos'] = json_decode($favorite['pasos'], true);
        $favorite['promedio_calificacion'] = round($favorite['promedio_calificacion'], 1);
        $favorite['total_calificaciones'] = intval($favorite['total_calificaciones']);
    }
    
    jsonResponse([
        'status' => 'success',
        'favorites' => $favorites
    ]);
}

/**
 * Agregar nuevo trago
 */
function addDrink() {
    if (!isAuthenticated()) {
        jsonResponse(['status' => 'error', 'message' => 'No autenticado'], 401);
    }
    
    global $pdo;
    $userId = getCurrentUserId();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar entrada
    $rules = [
        'nombre' => ['required' => true, 'min_length' => 3, 'max_length' => 100],
        'descripcion' => ['required' => true, 'max_length' => 500],
        'tipo' => ['required' => true, 'pattern' => '/^(con-alcohol|sin-alcohol)$/'],
        'imagen' => ['required' => true, 'max_length' => 100],
        'ingredientes' => ['required' => true],
        'pasos' => ['required' => true]
    ];
    
    $errors = validateInput($input, $rules);
    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'message' => 'Datos inválidos', 'errors' => $errors], 400);
    }
    
    $nombre = sanitizeInput($input['nombre']);
    $descripcion = sanitizeInput($input['descripcion']);
    $tipo = $input['tipo'];
    $imagen = sanitizeInput($input['imagen']);
    $ingredientes = json_encode($input['ingredientes']);
    $pasos = json_encode($input['pasos']);
    
    // Verificar si el trago ya existe
    $checkSql = "SELECT id FROM tragos WHERE nombre = ? AND activo = 1";
    if (fetchOne($pdo, $checkSql, [$nombre])) {
        jsonResponse(['status' => 'error', 'message' => 'Ya existe un trago con ese nombre'], 409);
    }
    
    // Insertar trago
    $insertSql = "INSERT INTO tragos (nombre, descripcion, tipo, imagen, ingredientes, pasos, usuario_id) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
    $drinkId = insertAndGetId($pdo, $insertSql, [$nombre, $descripcion, $tipo, $imagen, $ingredientes, $pasos, $userId]);
    
    jsonResponse([
        'status' => 'success',
        'message' => 'Trago agregado exitosamente',
        'drink_id' => $drinkId
    ]);
}

/**
 * Toggle favorito
 */
function toggleFavorite() {
    if (!isAuthenticated()) {
        jsonResponse(['status' => 'error', 'message' => 'No autenticado'], 401);
    }
    
    global $pdo;
    $userId = getCurrentUserId();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $drinkId = intval($input['drink_id'] ?? 0);
    
    if (!$drinkId) {
        jsonResponse(['status' => 'error', 'message' => 'ID de trago requerido'], 400);
    }
    
    // Verificar que el trago existe
    $checkSql = "SELECT id FROM tragos WHERE id = ? AND activo = 1";
    if (!fetchOne($pdo, $checkSql, [$drinkId])) {
        jsonResponse(['status' => 'error', 'message' => 'Trago no encontrado'], 404);
    }
    
    // Verificar si ya es favorito
    $favoriteSql = "SELECT id FROM favoritos WHERE usuario_id = ? AND trago_id = ?";
    $existing = fetchOne($pdo, $favoriteSql, [$userId, $drinkId]);
    
    if ($existing) {
        // Remover de favoritos
        $deleteSql = "DELETE FROM favoritos WHERE usuario_id = ? AND trago_id = ?";
        executeQuery($pdo, $deleteSql, [$userId, $drinkId]);
        $isFavorite = false;
    } else {
        // Agregar a favoritos
        $insertSql = "INSERT INTO favoritos (usuario_id, trago_id) VALUES (?, ?)";
        executeQuery($pdo, $insertSql, [$userId, $drinkId]);
        $isFavorite = true;
    }
    
    jsonResponse([
        'status' => 'success',
        'is_favorite' => $isFavorite,
        'message' => $isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos'
    ]);
}

/**
 * Calificar trago
 */
function rateDrink() {
    if (!isAuthenticated()) {
        jsonResponse(['status' => 'error', 'message' => 'No autenticado'], 401);
    }
    
    global $pdo;
    $userId = getCurrentUserId();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $drinkId = intval($input['drink_id'] ?? 0);
    $rating = intval($input['rating'] ?? 0);
    
    if (!$drinkId) {
        jsonResponse(['status' => 'error', 'message' => 'ID de trago requerido'], 400);
    }
    
    if ($rating < 1 || $rating > 5) {
        jsonResponse(['status' => 'error', 'message' => 'La calificación debe estar entre 1 y 5'], 400);
    }
    
    // Verificar que el trago existe
    $checkSql = "SELECT id FROM tragos WHERE id = ? AND activo = 1";
    if (!fetchOne($pdo, $checkSql, [$drinkId])) {
        jsonResponse(['status' => 'error', 'message' => 'Trago no encontrado'], 404);
    }
    
    // Insertar o actualizar calificación
    $upsertSql = "INSERT INTO calificaciones (usuario_id, trago_id, puntuacion) 
                   VALUES (?, ?, ?) 
                   ON DUPLICATE KEY UPDATE puntuacion = ?";
    executeQuery($pdo, $upsertSql, [$userId, $drinkId, $rating, $rating]);
    
    jsonResponse([
        'status' => 'success',
        'message' => 'Calificación guardada exitosamente'
    ]);
}
?>
