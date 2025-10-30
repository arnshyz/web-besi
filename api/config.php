<?php
$ADMIN_PASSWORD = getenv('CMS_ADMIN_PASSWORD') ?: 'ganti_password_ini';
$DATA_DIR = __DIR__ . '/../data';
session_start(); ?>