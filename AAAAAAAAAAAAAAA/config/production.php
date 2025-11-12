<?php
// Configuración de base de datos para Hostinger
// Credenciales provistas por el usuario
$DB_HOST = '193.203.175.157';
$DB_NAME = 'u157683007_pourfect';
$DB_USER = 'u157683007_octash';
$DB_PASS = 'Gaelyyael11';
$DB_CHARSET = 'utf8mb4';

if (session_status() === PHP_SESSION_NONE) {
	session_start();
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit();
}

function getDBConnection() {
	global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $DB_CHARSET;
	try {
		$dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=$DB_CHARSET";
		$pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES => false,
			PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_general_ci'
		]);
		$pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_general_ci");
		$pdo->exec("SET collation_connection = 'utf8mb4_general_ci'");
		return $pdo;
	} catch (PDOException $e) {
		error_log('DB connection error: ' . $e->getMessage());
		return null;
	}
}

function jsonResponse($data, $statusCode = 200) {
	http_response_code($statusCode);
	echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	exit();
}

function executeQuery($pdo, $sql, $params = []) {
	$stmt = $pdo->prepare($sql);
	$stmt->execute($params);
	return $stmt;
}

function fetchOne($pdo, $sql, $params = []) {
	return executeQuery($pdo, $sql, $params)->fetch();
}

function fetchAll($pdo, $sql, $params = []) {
	return executeQuery($pdo, $sql, $params)->fetchAll();
}

function insertAndGetId($pdo, $sql, $params = []) {
	executeQuery($pdo, $sql, $params);
	return $pdo->lastInsertId();
}

function isAuthenticated() { return isset($_SESSION['usuario_id']); }
function currentUserId() { return $_SESSION['usuario_id'] ?? null; }

function sanitize($s) { return htmlspecialchars(trim($s ?? ''), ENT_QUOTES, 'UTF-8'); }
?>


