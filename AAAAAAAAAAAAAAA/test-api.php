<?php
/**
 * Test de API para Pourfect
 * Archivo: test-api.php
 */

require_once './config/production.php';

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
    // Test de conexión a base de datos
    $pdo = getDBConnection();
    
    if (!$pdo) {
        throw new Exception('No se pudo conectar a la base de datos');
    }
    
    // Test de consulta simple
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
    $result = $stmt->fetch();
    
    $response = [
        'status' => 'success',
        'message' => 'API funcionando correctamente',
        'data' => [
            'database_connection' => 'OK',
            'total_users' => $result['total'],
            'timestamp' => date('Y-m-d H:i:s'),
            'server_info' => [
                'php_version' => PHP_VERSION,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'
            ]
        ]
    ];
    
    sendResponse($response);
    
} catch (Exception $e) {
    error_log("Error en test-api.php: " . $e->getMessage());
    sendError('Error en el test de API: ' . $e->getMessage(), 500);
}
?>
