<?php
require_once '../config/production.php';

// Solo POST con archivo 'imagen'
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	jsonResponse(['status'=>'error','message'=>'Método no permitido'],405);
}

if (!isset($_FILES['imagen']) || !is_uploaded_file($_FILES['imagen']['tmp_name'])) {
	jsonResponse(['status'=>'error','message'=>'Archivo no recibido'],400);
}

$file = $_FILES['imagen'];
if ($file['error'] !== UPLOAD_ERR_OK) {
	jsonResponse(['status'=>'error','message'=>'Error al subir'],400);
}

// Validaciones básicas
if ($file['size'] > 2 * 1024 * 1024) {
	jsonResponse(['status'=>'error','message'=>'Imagen > 2MB'],400);
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);
if (!in_array($mime, ['image/jpeg','image/pjpeg'])) {
	jsonResponse(['status'=>'error','message'=>'Solo JPG permitido'],400);
}

$ext = 'jpg';
$name = 'upload_'.time().'_'.substr(md5(random_bytes(8)),0,8).'.'.$ext;
$destDir = realpath(__DIR__ . '/../imagenes');
$dest = $destDir . DIRECTORY_SEPARATOR . $name;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
	jsonResponse(['status'=>'error','message'=>'No se pudo guardar'],500);
}

jsonResponse(['status'=>'success','filename'=>$name]);
?>


