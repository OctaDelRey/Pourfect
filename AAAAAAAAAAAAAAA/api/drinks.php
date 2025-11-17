<?php
require_once '../config/production.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$pdo = getDBConnection();
if(!$pdo) jsonResponse(['status'=>'error','message'=>'DB error'],500);

try {
	switch ($method) {
		case 'GET':
			switch ($action) {
				case 'favorites': getFavorites($pdo); break;
				case 'user_drinks': getUserDrinks($pdo); break;
				case 'detail': getDetail($pdo); break;
				default: jsonResponse(['status'=>'error','message'=>'Acción no válida'],400);
			}
			break;
		case 'POST':
			switch ($action) {
				case 'add': addDrink($pdo); break;
				case 'favorite': toggleFavorite($pdo); break;
				case 'rate': rateDrink($pdo); break;
				default: jsonResponse(['status'=>'error','message'=>'Acción no válida'],400);
			}
			break;
		case 'DELETE':
			switch ($action) {
				case 'delete': deleteDrink($pdo); break;
				default: jsonResponse(['status'=>'error','message'=>'Acción no válida'],400);
			}
			break;
		default:
			jsonResponse(['status'=>'error','message'=>'Método no permitido'],405);
	}
} catch (Exception $e) {
	jsonResponse(['status'=>'error','message'=>$e->getMessage()],500);
}

function requireAuth(){ if(!isAuthenticated()) jsonResponse(['status'=>'error','message'=>'No autenticado'],401); }

function addDrink($pdo){
	requireAuth();
	$input = json_decode(file_get_contents('php://input'), true) ?? [];
	$nombre = sanitize($input['nombre'] ?? '');
	$descripcion = sanitize($input['descripcion'] ?? '');
	$tipo = sanitize($input['tipo'] ?? '');
	$imagen = sanitize($input['imagen'] ?? 'placeholder.jpg');
	if(!$nombre || !$tipo) jsonResponse(['status'=>'error','message'=>'Datos faltantes'],400);
	$id = insertAndGetId($pdo,'INSERT INTO tragos(nombre,descripcion,tipo,imagen,usuario_id,fecha_creacion,eliminado) VALUES(?,?,?,?,?,NOW(),0)',[
		$nombre,$descripcion,$tipo,$imagen,currentUserId()
	]);
	jsonResponse(['status'=>'success','drink_id'=>intval($id)]);
}

function toggleFavorite($pdo){
	requireAuth();
	$input = json_decode(file_get_contents('php://input'), true) ?? [];
	$drinkId = intval($input['drink_id'] ?? 0);
	if(!$drinkId) jsonResponse(['status'=>'error','message'=>'ID inválido'],400);
	$exists = fetchOne($pdo,'SELECT id FROM favoritos WHERE usuario_id=? AND trago_id=?',[currentUserId(),$drinkId]);
	if($exists){
		executeQuery($pdo,'DELETE FROM favoritos WHERE id=?',[$exists['id']]);
		jsonResponse(['status'=>'success','is_favorite'=>false]);
	}else{
		insertAndGetId($pdo,'INSERT INTO favoritos(usuario_id,trago_id,fecha_agregado) VALUES(?,?,NOW())',[currentUserId(),$drinkId]);
		jsonResponse(['status'=>'success','is_favorite'=>true]);
	}
}

function getFavorites($pdo){
	requireAuth();
	$sql = 'SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
		IFNULL(AVG(c.calificacion),0) as promedio,
		COUNT(c.id) as total_calificaciones,
		MAX(CASE WHEN c.usuario_id=? THEN c.calificacion ELSE NULL END) as user_rating
		FROM favoritos f
		JOIN tragos t ON t.id=f.trago_id AND t.eliminado=0
		LEFT JOIN calificaciones c ON c.trago_id=t.id
		WHERE f.usuario_id=?
		GROUP BY t.id
		ORDER BY f.fecha_agregado DESC';
	$params = [currentUserId(), currentUserId()];
	$rows = fetchAll($pdo,$sql,$params);
	$favs = array_map(function($row){
		return [
			'id'=>intval($row['id']),
			'nombre'=>$row['nombre'],
			'descripcion'=>$row['descripcion'],
			'tipo'=>$row['tipo'],
			'imagen'=>$row['imagen'],
			'promedio'=>round(floatval($row['promedio']),1),
			'total_calificaciones'=>intval($row['total_calificaciones']),
			'user_rating'=>$row['user_rating'] !== null ? floatval($row['user_rating']) : 0,
			'is_favorite'=>true
		];
	}, $rows);
	jsonResponse(['status'=>'success','favorites'=>$favs]);
}

function rateDrink($pdo){
	requireAuth();
	$input = json_decode(file_get_contents('php://input'), true) ?? [];
	$drinkId = intval($input['drink_id'] ?? 0);
	$rating = intval($input['rating'] ?? 0);
	if($rating<1 || $rating>5 || !$drinkId) jsonResponse(['status'=>'error','message'=>'Datos inválidos'],400);
	$key = fetchOne($pdo,'SELECT id FROM calificaciones WHERE usuario_id=? AND trago_id=?',[currentUserId(),$drinkId]);
	if($key){
		executeQuery($pdo,'UPDATE calificaciones SET calificacion=?,fecha=NOW() WHERE id=?',[$rating,$key['id']]);
	}else{
		insertAndGetId($pdo,'INSERT INTO calificaciones(usuario_id,trago_id,calificacion,fecha) VALUES(?,?,?,NOW())',[currentUserId(),$drinkId,$rating]);
	}
	jsonResponse(['status'=>'success']);
}

function getUserDrinks($pdo){
	requireAuth();
	$sql='SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
		IFNULL(AVG(c.calificacion),0) as promedio_calificacion,
		COUNT(c.id) as total_calificaciones
		FROM tragos t
		LEFT JOIN calificaciones c ON c.trago_id=t.id
		WHERE t.usuario_id=? AND t.eliminado=0
		GROUP BY t.id
		ORDER BY t.fecha_creacion DESC';
	$rows = fetchAll($pdo,$sql,[currentUserId()]);
	jsonResponse(['status'=>'success','drinks'=>$rows]);
}

function deleteDrink($pdo){
	requireAuth();
	$id = intval($_GET['id'] ?? 0);
	if(!$id) jsonResponse(['status'=>'error','message'=>'ID inválido'],400);
	executeQuery($pdo,'UPDATE tragos SET eliminado=1 WHERE id=? AND usuario_id=?',[$id,currentUserId()]);
	jsonResponse(['status'=>'success']);
}

function getDetail($pdo){
	$id = intval($_GET['id'] ?? 0);
	if(!$id) jsonResponse(['status'=>'error','message'=>'ID inválido'],400);
	$userId = isAuthenticated() ? currentUserId() : null;
	if ($userId) {
		$sql = "SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
			IFNULL(AVG(c.calificacion),0) as promedio,
			COUNT(c.id) as total_calificaciones,
			MAX(CASE WHEN c.usuario_id=? THEN c.calificacion ELSE NULL END) as user_rating
			FROM tragos t
			LEFT JOIN calificaciones c ON c.trago_id=t.id
			WHERE t.id=? AND t.eliminado=0
			GROUP BY t.id";
		$params = [$userId,$id];
	} else {
		$sql = "SELECT t.id,t.nombre,t.descripcion,t.tipo,t.imagen,
			IFNULL(AVG(c.calificacion),0) as promedio,
			COUNT(c.id) as total_calificaciones,
			NULL as user_rating
			FROM tragos t
			LEFT JOIN calificaciones c ON c.trago_id=t.id
			WHERE t.id=? AND t.eliminado=0
			GROUP BY t.id";
		$params = [$id];
	}
	$row = fetchOne($pdo,$sql,$params);
	if(!$row) jsonResponse(['status'=>'error','message'=>'No encontrado'],404);
	$row['promedio'] = round(floatval($row['promedio']),1);
	$row['total_calificaciones'] = intval($row['total_calificaciones']);
	$row['user_rating'] = $row['user_rating'] !== null ? floatval($row['user_rating']) : 0;
	if ($userId) {
		$fav = fetchOne($pdo,'SELECT id FROM favoritos WHERE usuario_id=? AND trago_id=?',[$userId,$id]);
		$row['is_favorite'] = $fav ? true : false;
	} else {
		$row['is_favorite'] = false;
	}
	jsonResponse(['status'=>'success','drink'=>$row]);
}
?>


