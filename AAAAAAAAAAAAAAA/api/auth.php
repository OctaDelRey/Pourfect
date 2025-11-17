<?php
require_once '../config/production.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
	switch ($method) {
		case 'POST':
			switch ($action) {
				case 'login': login(); break;
				case 'register': registerUser(); break;
				case 'logout': logoutUser(); break;
				default: jsonResponse(['status'=>'error','message'=>'Acción no válida'],400);
			}
			break;
		case 'GET':
			switch ($action) {
				case 'check': checkAuth(); break;
				case 'profile': getProfile(); break;
				default: jsonResponse(['status'=>'error','message'=>'Acción no válida'],400);
			}
			break;
	case 'PUT':
		$input = json_decode(file_get_contents('php://input'), true) ?? [];
		$action = $input['action'] ?? $_GET['action'] ?? '';
		if ($action === 'update') {
			updateProfile();
		} else {
			updateProfile();
		}
		break;
		default:
			jsonResponse(['status'=>'error','message'=>'Método no permitido'],405);
	}
} catch (Exception $e) {
	jsonResponse(['status'=>'error','message'=>'Error: '.$e->getMessage()],500);
}

function login(){
	$pdo = getDBConnection();
	if(!$pdo) jsonResponse(['status'=>'error','message'=>'DB error'],500);
	$input = json_decode(file_get_contents('php://input'), true) ?? [];
	$user = sanitize($input['usuario'] ?? '');
	$pass = $input['password'] ?? '';
	if(strlen($user)<3 || strlen($pass)<4) jsonResponse(['status'=>'error','message'=>'Datos inválidos'],400);
	$row = fetchOne($pdo, 'SELECT id,usuario,password_hash,foto,bio FROM usuarios WHERE usuario=? AND activo=1', [$user]);
	if(!$row || !password_verify($pass, $row['password_hash'])){
		jsonResponse(['status'=>'error','message'=>'Credenciales inválidas'],401);
	}
	executeQuery($pdo,'UPDATE usuarios SET ultimo_acceso=NOW() WHERE id=?',[$row['id']]);
	$_SESSION['usuario_id']=$row['id'];
	$_SESSION['usuario']=$row['usuario'];
	jsonResponse(['status'=>'success','user'=>[
		'id'=>$row['id'],'usuario'=>$row['usuario'],'foto'=>$row['foto'] ?: 'avatar.png','bio'=>$row['bio'] ?: ''
	]]);
}

function registerUser(){
	$pdo = getDBConnection();
	if(!$pdo) jsonResponse(['status'=>'error','message'=>'DB error'],500);
	$input = json_decode(file_get_contents('php://input'), true) ?? [];
	$user = sanitize($input['usuario'] ?? '');
	$pass = $input['password'] ?? '';
	if(strlen($user)<3 || strlen($pass)<4) jsonResponse(['status'=>'error','message'=>'Datos inválidos'],400);
	if(fetchOne($pdo,'SELECT id FROM usuarios WHERE usuario=?',[$user])) jsonResponse(['status'=>'error','message'=>'Usuario ya existe'],409);
	$hash = password_hash($pass, PASSWORD_DEFAULT);
	$id = insertAndGetId($pdo,'INSERT INTO usuarios(usuario,password_hash,bio,foto,activo,fecha_registro) VALUES(?,?,?,?,1,NOW())',[$user,$hash,'Nuevo usuario de Pourfect','avatar.png']);
	$_SESSION['usuario_id']=$id; $_SESSION['usuario']=$user;
	jsonResponse(['status'=>'success','user'=>['id'=>$id,'usuario'=>$user,'foto'=>'avatar.png','bio'=>'Nuevo usuario de Pourfect']]);
}

function logoutUser(){
	session_destroy();
	jsonResponse(['status'=>'success']);
}

function checkAuth(){
	if(!isAuthenticated()) jsonResponse(['status'=>'success','authenticated'=>false]);
	$pdo = getDBConnection();
	$user = fetchOne($pdo,'SELECT id,usuario,foto,bio FROM usuarios WHERE id=?',[currentUserId()]);
	jsonResponse(['status'=>'success','authenticated'=>true,'user'=>$user]);
}

function getProfile(){
	if(!isAuthenticated()) jsonResponse(['status'=>'error','message'=>'No autenticado'],401);
	$pdo = getDBConnection();
	$user = fetchOne($pdo,'SELECT id,usuario,foto,bio,fecha_registro FROM usuarios WHERE id=?',[currentUserId()]);
	jsonResponse(['status'=>'success','user'=>$user]);
}

function updateProfile(){
	if(!isAuthenticated()) jsonResponse(['status'=>'error','message'=>'No autenticado'],401);
	$pdo = getDBConnection();
	$input = json_decode(file_get_contents('php://input'), true) ?? [];
	$usuario = sanitize($input['usuario'] ?? '');
	$bio = substr(sanitize($input['bio'] ?? ''),0,100);
	$foto = sanitize($input['foto'] ?? '');
	if($usuario && strlen($usuario) < 3) jsonResponse(['status'=>'error','message'=>'Usuario muy corto'],400);
	executeQuery($pdo,'UPDATE usuarios SET usuario = COALESCE(NULLIF(?,""), usuario), bio = ?, foto = COALESCE(NULLIF(?,""), foto) WHERE id=?',[$usuario,$bio,$foto,currentUserId()]);
	jsonResponse(['status'=>'success']);
}
?>


