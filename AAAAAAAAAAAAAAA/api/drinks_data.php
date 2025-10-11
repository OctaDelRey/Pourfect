<?php
// Archivo para obtener todos los tragos desde JavaScript y convertirlos a JSON para la API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir el archivo de configuración de la base de datos
require_once 'config.php';

// Función para obtener todos los tragos desde la base de datos
function getAllDrinks() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                d.id,
                d.nombre,
                d.descripcion,
                d.tipo,
                d.imagen,
                d.ingredientes,
                d.pasos,
                d.created_at,
                u.usuario as creador,
                AVG(r.rating) as promedio,
                COUNT(r.id) as total_calificaciones
            FROM drinks d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN ratings r ON d.id = r.drink_id
            GROUP BY d.id
            ORDER BY d.created_at DESC
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
                'created_at' => $drink['created_at']
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
                d.id,
                d.nombre,
                d.descripcion,
                d.tipo,
                d.imagen,
                d.ingredientes,
                d.pasos,
                d.created_at,
                u.usuario as creador,
                AVG(r.rating) as promedio,
                COUNT(r.id) as total_calificaciones
            FROM drinks d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN ratings r ON d.id = r.drink_id
            WHERE d.tipo = ?
            GROUP BY d.id
            ORDER BY d.created_at DESC
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
                'created_at' => $drink['created_at']
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
                d.id,
                d.nombre,
                d.descripcion,
                d.tipo,
                d.imagen,
                d.ingredientes,
                d.pasos,
                d.created_at,
                u.usuario as creador,
                AVG(r.rating) as promedio,
                COUNT(r.id) as total_calificaciones
            FROM drinks d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN ratings r ON d.id = r.drink_id
            WHERE d.nombre LIKE ? OR d.descripcion LIKE ?
            GROUP BY d.id
            ORDER BY d.created_at DESC
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
                'created_at' => $drink['created_at']
            ];
        }
        
        return $processedDrinks;
        
    } catch (PDOException $e) {
        error_log("Error en searchDrinks: " . $e->getMessage());
        return [];
    }
}

// Manejar las peticiones
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
    ]);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>
