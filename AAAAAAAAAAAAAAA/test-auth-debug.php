<?php
/**
 * Test de diagnóstico para API de autenticación
 * Archivo: test-auth-debug.php
 */

// Headers básicos
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$debug = [];

// Test 1: Verificar PHP
$debug['php_version'] = PHP_VERSION;
$debug['php_extensions'] = [
    'pdo' => extension_loaded('pdo'),
    'pdo_mysql' => extension_loaded('pdo_mysql'),
    'json' => extension_loaded('json'),
    'session' => extension_loaded('session')
];

// Test 2: Verificar archivos
$files = [
    'config/production.php' => 'Configuración de producción',
    'api/auth.php' => 'API de autenticación original',
    'api/auth-standalone.php' => 'API de autenticación standalone'
];

foreach ($files as $file => $description) {
    $debug['files'][$file] = [
        'exists' => file_exists($file),
        'readable' => file_exists($file) ? is_readable($file) : false,
        'size' => file_exists($file) ? filesize($file) : 0,
        'description' => $description
    ];
}

// Test 3: Verificar configuración de base de datos
$host = 'localhost';
$dbname = 'u157683007_pourfect';
$username = 'u157683007_octash';
$password = 'Gaelyyael11';
$charset = 'utf8mb4';

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    $debug['database'] = [
        'connection' => 'success',
        'host' => $host,
        'database' => $dbname,
        'username' => $username
    ];
    
    // Verificar tablas
    $tables = ['usuarios', 'tragos', 'favoritos', 'calificaciones'];
    $existingTables = [];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            $existingTables[] = $table;
        }
    }
    
    $debug['database']['tables'] = $existingTables;
    
    // Contar usuarios
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios WHERE activo = 1");
    $userCount = $stmt->fetch()['total'];
    $debug['database']['user_count'] = $userCount;
    
} catch (PDOException $e) {
    $debug['database'] = [
        'connection' => 'failed',
        'error' => $e->getMessage(),
        'host' => $host,
        'database' => $dbname,
        'username' => $username
    ];
}

// Test 4: Verificar permisos de directorios
$directories = ['logs', 'cache', 'api'];
foreach ($directories as $dir) {
    $debug['directories'][$dir] = [
        'exists' => is_dir($dir),
        'writable' => is_dir($dir) ? is_writable($dir) : false,
        'readable' => is_dir($dir) ? is_readable($dir) : false
    ];
}

// Test 5: Verificar configuración del servidor
$debug['server'] = [
    'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
    'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'php_sapi' => php_sapi_name()
];

// Test 6: Verificar errores de PHP
$debug['php_errors'] = [
    'display_errors' => ini_get('display_errors'),
    'log_errors' => ini_get('log_errors'),
    'error_log' => ini_get('error_log'),
    'error_reporting' => ini_get('error_reporting')
];

// Test 7: Probar include de archivos
$debug['includes'] = [];

// Probar config/production.php
if (file_exists('config/production.php')) {
    try {
        ob_start();
        include 'config/production.php';
        $output = ob_get_clean();
        $debug['includes']['config/production.php'] = [
            'success' => true,
            'output' => $output,
            'functions_defined' => [
                'getDBConnection' => function_exists('getDBConnection'),
                'jsonResponse' => function_exists('jsonResponse'),
                'validateInput' => function_exists('validateInput')
            ]
        ];
    } catch (Exception $e) {
        $debug['includes']['config/production.php'] = [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
} else {
    $debug['includes']['config/production.php'] = [
        'success' => false,
        'error' => 'Archivo no existe'
    ];
}

// Respuesta final
$response = [
    'status' => 'success',
    'message' => 'Diagnóstico completado',
    'timestamp' => date('Y-m-d H:i:s'),
    'debug' => $debug
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
exit();
?>
