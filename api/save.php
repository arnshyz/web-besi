<?php require __DIR__.'/guard.php';
$name = $_GET['name'] ?? ''; $path = realpath(__DIR__.'/../data') . '/' . basename($name) . '.json';
$body = file_get_contents('php://input'); if (!$name) { http_response_code(400); echo 'name required'; exit; }
if (json_decode($body) === null && json_last_error() !== JSON_ERROR_NONE) { http_response_code(400); echo 'invalid json'; exit; }
file_put_contents($path, $body); echo 'ok'; ?>