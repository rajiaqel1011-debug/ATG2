<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/projects_db.json';

// حفظ المشاريع عند استقبال POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if ($input) {
        file_put_contents($dataFile, $input);
        echo json_encode(['status' => 'success', 'message' => 'Projects saved successfully']);
        exit;
    }
}

// قراءة المشاريع عند استقبال GET
if (file_exists($dataFile)) {
    echo file_get_contents($dataFile);
} else {
    echo json_encode([]);
}
