<?php require __DIR__.'/config.php';
$name = $_GET['name'] ?? ''; $path = realpath($DATA_DIR) . '/' . basename($name) . '.json';
if (!$name || !file_exists($path)) { http_response_code(404); echo 'not found'; exit; }
header('Content-Type: application/json; charset=utf-8'); readfile($path); ?>