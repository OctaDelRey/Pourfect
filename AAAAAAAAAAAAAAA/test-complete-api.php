<?php
/**
 * Test completo de todas las APIs para Pourfect
 * Archivo: test-complete-api.php
 */

require_once 'config/production.php';

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

$tests = [];
$errors = [];

// Test 1: Conexión a base de datos
try {
    $pdo = getDBConnection();
    if ($pdo) {
        $tests[] = ['name' => 'Conexión a Base de Datos', 'status' => 'success', 'message' => 'Conexión exitosa'];
    } else {
        $tests[] = ['name' => 'Conexión a Base de Datos', 'status' => 'error', 'message' => 'No se pudo conectar'];
        $errors[] = 'Error de conexión a la base de datos';
    }
} catch (Exception $e) {
    $tests[] = ['name' => 'Conexión a Base de Datos', 'status' => 'error', 'message' => $e->getMessage()];
    $errors[] = $e->getMessage();
}

// Test 2: Verificar tablas existentes
if (isset($pdo)) {
    try {
        $tables = ['usuarios', 'tragos', 'favoritos', 'calificaciones'];
        $existingTables = [];
        
        foreach ($tables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                $existingTables[] = $table;
            }
        }
        
        if (count($existingTables) === count($tables)) {
            $tests[] = ['name' => 'Tablas de Base de Datos', 'status' => 'success', 'message' => 'Todas las tablas existen: ' . implode(', ', $existingTables)];
        } else {
            $missing = array_diff($tables, $existingTables);
            $tests[] = ['name' => 'Tablas de Base de Datos', 'status' => 'warning', 'message' => 'Faltan tablas: ' . implode(', ', $missing)];
        }
    } catch (Exception $e) {
        $tests[] = ['name' => 'Tablas de Base de Datos', 'status' => 'error', 'message' => $e->getMessage()];
        $errors[] = $e->getMessage();
    }
}

// Test 3: Verificar datos en tablas
if (isset($pdo)) {
    try {
        // Contar usuarios
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios WHERE activo = 1");
        $userCount = $stmt->fetch()['total'];
        
        // Contar tragos
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM tragos WHERE eliminado = 0");
        $drinkCount = $stmt->fetch()['total'];
        
        $tests[] = ['name' => 'Datos en Base de Datos', 'status' => 'success', 'message' => "Usuarios activos: $userCount, Tragos: $drinkCount"];
    } catch (Exception $e) {
        $tests[] = ['name' => 'Datos en Base de Datos', 'status' => 'error', 'message' => $e->getMessage()];
        $errors[] = $e->getMessage();
    }
}

// Test 4: Verificar archivos de API
$apiFiles = [
    'api/auth.php' => 'API de Autenticación',
    'api/drinks.php' => 'API de Tragos',
    'api/drinks_data.php' => 'API de Datos de Tragos',
    'api/users.php' => 'API de Usuarios'
];

foreach ($apiFiles as $file => $name) {
    if (file_exists($file)) {
        $tests[] = ['name' => $name, 'status' => 'success', 'message' => 'Archivo existe'];
    } else {
        $tests[] = ['name' => $name, 'status' => 'error', 'message' => 'Archivo no encontrado'];
        $errors[] = "Archivo $file no encontrado";
    }
}

// Test 5: Verificar permisos de directorios
$directories = ['logs', 'cache'];
foreach ($directories as $dir) {
    if (is_dir($dir)) {
        if (is_writable($dir)) {
            $tests[] = ['name' => "Directorio $dir", 'status' => 'success', 'message' => 'Directorio existe y es escribible'];
        } else {
            $tests[] = ['name' => "Directorio $dir", 'status' => 'warning', 'message' => 'Directorio existe pero no es escribible'];
        }
    } else {
        $tests[] = ['name' => "Directorio $dir", 'status' => 'warning', 'message' => 'Directorio no existe (se creará automáticamente)'];
    }
}

// Test 6: Verificar configuración PHP
$phpTests = [
    'PHP Version' => PHP_VERSION,
    'PDO MySQL' => extension_loaded('pdo_mysql') ? 'Disponible' : 'No disponible',
    'JSON' => extension_loaded('json') ? 'Disponible' : 'No disponible',
    'Session' => extension_loaded('session') ? 'Disponible' : 'No disponible'
];

foreach ($phpTests as $name => $value) {
    $tests[] = ['name' => $name, 'status' => 'success', 'message' => $value];
}

// Respuesta final
$response = [
    'status' => empty($errors) ? 'success' : 'warning',
    'message' => empty($errors) ? 'Todos los tests pasaron correctamente' : 'Algunos tests fallaron',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
    ],
    'tests' => $tests,
    'errors' => $errors,
    'summary' => [
        'total_tests' => count($tests),
        'successful' => count(array_filter($tests, function($test) { return $test['status'] === 'success'; })),
        'warnings' => count(array_filter($tests, function($test) { return $test['status'] === 'warning'; })),
        'errors' => count(array_filter($tests, function($test) { return $test['status'] === 'error'; }))
    ]
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit();
?>
