<?php
require_once '../config/production.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method !== 'GET') jsonResponse(['status'=>'error','message'=>'Método no permitido'],405);

switch ($action) {
	case 'search': searchUsers(); break;
	case 'profile': getUserProfile(); break;
	default: jsonResponse(['status'=>'error','message'=>'Acción no válida'],400);
}

function searchUsers(){
	$pdo = getDBConnection();
	if(!$pdo) jsonResponse(['status'=>'error','message'=>'DB error'],500);
	$q = '%'.(trim($_GET['query'] ?? '')).'%';
	$sql = "SELECT u.id,u.usuario,u.foto,u.bio,u.fecha_registro,
			COUNT(t.id) total_tragos, ROUND(IFNULL(AVG(c.calificacion),0),1) promedio_calificacion
			FROM usuarios u
			LEFT JOIN tragos t ON t.usuario_id=u.id AND t.eliminado=0
			LEFT JOIN calificaciones c ON c.trago_id=t.id
			WHERE u.usuario LIKE ? AND u.activo=1
			GROUP BY u.id
			ORDER BY u.usuario ASC LIMIT 20";
	$rows = fetchAll($pdo,$sql,[$q]);
	jsonResponse(['status'=>'success','users'=>$rows]);
}

function getUserProfile(){
	$pdo = getDBConnection();
	if(!$pdo) jsonResponse(['status'=>'error','message'=>'DB error'],500);
	$id = intval($_GET['id'] ?? 0);
	$user = fetchOne($pdo,'SELECT id,usuario,foto,bio,fecha_registro FROM usuarios WHERE id=? AND activo=1',[$id]);
	if(!$user) jsonResponse(['status'=>'error','message'=>'Usuario no encontrado'],404);
	$drinks = fetchAll($pdo,'SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen, ROUND(IFNULL(AVG(c.calificacion),0),1) promedio_calificacion, COUNT(c.id) total_calificaciones FROM tragos t LEFT JOIN calificaciones c ON c.trago_id=t.id WHERE t.usuario_id=? AND t.eliminado=0 GROUP BY t.id ORDER BY t.fecha_creacion DESC',[$id]);
	
	// Obtener favoritos reales del usuario
	$favoritesCount = fetchOne($pdo,'SELECT COUNT(*) as total FROM favoritos WHERE usuario_id=?',[$id]);
	$user['total_favoritos'] = intval($favoritesCount['total'] ?? 0);
	
	jsonResponse(['status'=>'success','user'=>$user,'drinks'=>$drinks]);
}
?>


