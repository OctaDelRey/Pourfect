<?php
// Archivo para obtener todos los tragos desde JavaScript y convertirlos a JSON para la API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir el archivo de configuración optimizada
require_once '../config/final.php';

// Función para obtener todos los tragos desde la base de datos
function getAllDrinks() {
    $pdo = getDBConnection();
    if (!$pdo) {
        return ['error' => 'Error de conexión a la base de datos'];
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                t.id,
                t.nombre,
                t.descripcion,
                t.tipo,
                t.imagen,
                t.ingredientes,
                t.pasos,
                t.fecha_creacion,
                u.usuario as creador,
                AVG(c.calificacion) as promedio,
                COUNT(c.id) as total_calificaciones
            FROM tragos t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE 1=1
            GROUP BY t.id
            ORDER BY t.fecha_creacion DESC
        ");
        
        $stmt->execute();
        $drinks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Procesar los datos para que coincidan con el formato JavaScript
        $processedDrinks = [];
        foreach ($drinks as $drink) {
            $processedDrinks[] = [
                'id' => (int)$drink['id'],
                'nombre' => $drink['nombre'],
                'descripcion' => $drink['descripcion'],
                'tipo' => $drink['tipo'],
                'imagen' => $drink['imagen'],
                'ingredientes' => json_decode($drink['ingredientes'], true),
                'pasos' => json_decode($drink['pasos'], true),
                'creador' => $drink['creador'],
                'promedio' => $drink['promedio'] ? round($drink['promedio'], 1) : 0,
                'total_calificaciones' => (int)$drink['total_calificaciones'],
                'created_at' => $drink['fecha_creacion']
            ];
        }
        
        return $processedDrinks;
        
    } catch (PDOException $e) {
        error_log("Error en getAllDrinks: " . $e->getMessage());
        return [];
    }
}

// Función para obtener tragos por tipo
function getDrinksByType($tipo) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                t.id,
                t.nombre,
                t.descripcion,
                t.tipo,
                t.imagen,
                t.ingredientes,
                t.pasos,
                t.fecha_creacion,
                u.usuario as creador,
                AVG(c.calificacion) as promedio,
                COUNT(c.id) as total_calificaciones
            FROM tragos t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE t.tipo = ?
            GROUP BY t.id
            ORDER BY t.fecha_creacion DESC
        ");
        
        $stmt->execute([$tipo]);
        $drinks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Procesar los datos
        $processedDrinks = [];
        foreach ($drinks as $drink) {
            $processedDrinks[] = [
                'id' => (int)$drink['id'],
                'nombre' => $drink['nombre'],
                'descripcion' => $drink['descripcion'],
                'tipo' => $drink['tipo'],
                'imagen' => $drink['imagen'],
                'ingredientes' => json_decode($drink['ingredientes'], true),
                'pasos' => json_decode($drink['pasos'], true),
                'creador' => $drink['creador'],
                'promedio' => $drink['promedio'] ? round($drink['promedio'], 1) : 0,
                'total_calificaciones' => (int)$drink['total_calificaciones'],
                'created_at' => $drink['fecha_creacion']
            ];
        }
        
        return $processedDrinks;
        
    } catch (PDOException $e) {
        error_log("Error en getDrinksByType: " . $e->getMessage());
        return [];
    }
}

// Función para buscar tragos
function searchDrinks($query) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                t.id,
                t.nombre,
                t.descripcion,
                t.tipo,
                t.imagen,
                t.ingredientes,
                t.pasos,
                t.fecha_creacion,
                u.usuario as creador,
                AVG(c.calificacion) as promedio,
                COUNT(c.id) as total_calificaciones
            FROM tragos t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN calificaciones c ON t.id = c.trago_id
            WHERE (t.nombre LIKE ? OR t.descripcion LIKE ?)
            GROUP BY t.id
            ORDER BY t.fecha_creacion DESC
        ");
        
        $searchTerm = "%$query%";
        $stmt->execute([$searchTerm, $searchTerm]);
        $drinks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Procesar los datos
        $processedDrinks = [];
        foreach ($drinks as $drink) {
            $processedDrinks[] = [
                'id' => (int)$drink['id'],
                'nombre' => $drink['nombre'],
                'descripcion' => $drink['descripcion'],
                'tipo' => $drink['tipo'],
                'imagen' => $drink['imagen'],
                'ingredientes' => json_decode($drink['ingredientes'], true),
                'pasos' => json_decode($drink['pasos'], true),
                'creador' => $drink['creador'],
                'promedio' => $drink['promedio'] ? round($drink['promedio'], 1) : 0,
                'total_calificaciones' => (int)$drink['total_calificaciones'],
                'created_at' => $drink['fecha_creacion']
            ];
        }
        
        return $processedDrinks;
        
    } catch (PDOException $e) {
        error_log("Error en searchDrinks: " . $e->getMessage());
        return [];
    }
}

// Manejar las peticiones
try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $action = $_GET['action'] ?? 'all';
        $tipo = $_GET['tipo'] ?? '';
        $query = $_GET['query'] ?? '';
        
        switch ($action) {
            case 'all':
                $drinks = getAllDrinks();
                break;
            case 'by_type':
                if ($tipo) {
                    $drinks = getDrinksByType($tipo);
                } else {
                    $drinks = getAllDrinks();
                }
                break;
            case 'search':
                if ($query) {
                    $drinks = searchDrinks($query);
                } else {
                    $drinks = getAllDrinks();
                }
                break;
            default:
                $drinks = getAllDrinks();
        }
        
        echo json_encode([
            'success' => true,
            'data' => $drinks,
            'total' => count($drinks)
        ], JSON_UNESCAPED_UNICODE);
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    error_log("Error en drinks_data.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ], JSON_UNESCAPED_UNICODE);
}
?>
