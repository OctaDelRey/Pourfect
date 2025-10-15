<?php
/**
 * Test simple de API para Pourfect
 */

// Headers básicos
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Respuesta simple
$response = [
    'status' => 'success',
    'message' => 'API funcionando correctamente',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => [
        'php_version' => PHP_VERSION,
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'] ?? 'unknown'
    ]
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit();
?>
