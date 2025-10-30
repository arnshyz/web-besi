<?php require __DIR__.'/config.php';
if (!($_SESSION['ok'] ?? false)) { http_response_code(401); echo 'unauthorized'; exit; } ?>