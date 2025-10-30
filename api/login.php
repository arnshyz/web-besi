<?php require __DIR__.'/config.php';
$in = json_decode(file_get_contents('php://input'), true);
if (($in['password'] ?? '') === $ADMIN_PASSWORD) { $_SESSION['ok']=true; echo 'ok'; }
else { http_response_code(401); echo 'invalid'; } ?>