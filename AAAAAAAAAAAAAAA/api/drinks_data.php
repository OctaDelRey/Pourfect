<?php
require_once '../config/production.php';

$pdo = getDBConnection();
if(!$pdo) jsonResponse(['success'=>false,'message'=>'DB error'],500);

$action = $_GET['action'] ?? 'all';
$page = max(1, intval($_GET['page'] ?? 1));
$limit = 100;
$offset = ($page-1)*$limit;
$userId = isAuthenticated() ? currentUserId() : null;
$userRatingSelect = $userId ? ", MAX(CASE WHEN c.usuario_id=? THEN c.calificacion ELSE NULL END) as user_rating" : ", NULL as user_rating";

if ($action === 'search') {
	$query = '%'.(trim($_GET['query'] ?? '')).'%';
	$sql = "SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
			IFNULL(AVG(c.calificacion),0) as promedio_calificacion,
			COUNT(c.id) as total_calificaciones
			$userRatingSelect
			FROM tragos t
			LEFT JOIN calificaciones c ON c.trago_id=t.id
			WHERE t.eliminado=0 AND (t.nombre LIKE ? OR t.descripcion LIKE ?)
			GROUP BY t.id
			ORDER BY t.fecha_creacion DESC
			LIMIT $limit OFFSET $offset";
	$params = [$query,$query];
} elseif ($action === 'by_type') {
	$tipo = $_GET['tipo'] ?? '';
	$sql = "SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
			IFNULL(AVG(c.calificacion),0) as promedio_calificacion,
			COUNT(c.id) as total_calificaciones
			$userRatingSelect
			FROM tragos t
			LEFT JOIN calificaciones c ON c.trago_id=t.id
			WHERE t.eliminado=0 AND t.tipo=?
			GROUP BY t.id
			ORDER BY t.fecha_creacion DESC
			LIMIT $limit OFFSET $offset";
	$params = [$tipo];
} else {
	$sql = "SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
			IFNULL(AVG(c.calificacion),0) as promedio_calificacion,
			COUNT(c.id) as total_calificaciones
			$userRatingSelect
			FROM tragos t
			LEFT JOIN calificaciones c ON c.trago_id=t.id
			WHERE t.eliminado=0
			GROUP BY t.id
			ORDER BY t.fecha_creacion DESC
			LIMIT $limit OFFSET $offset";
	$params = [];
}

$paramsWithUser = $params;
if (!is_null($userId)) {
	$paramsWithUser[] = $userId;
}

$rows = fetchAll($pdo,$sql,$paramsWithUser);

// marcar favoritos del usuario autenticado
$favIds = [];
if (isAuthenticated()) {
	$favRows = fetchAll($pdo,'SELECT trago_id FROM favoritos WHERE usuario_id=?',[currentUserId()]);
	$favIds = array_map(fn($r)=>intval($r['trago_id']), $favRows);
}

$data = array_map(function($r) use ($favIds, $userId){
	return [
		'id'=>intval($r['id']),
		'nombre'=>$r['nombre'],
		'descripcion'=>$r['descripcion'],
		'tipo'=>$r['tipo'],
		'imagen'=>$r['imagen'],
		'promedio'=>round(floatval($r['promedio_calificacion']),1),
		'total_calificaciones'=>intval($r['total_calificaciones']),
		'is_favorite'=>in_array(intval($r['id']),$favIds),
		'user_rating'=>!is_null($userId) && isset($r['user_rating']) ? floatval($r['user_rating']) : 0
	];
}, $rows);

jsonResponse(['success'=>true,'data'=>$data]);
?>


