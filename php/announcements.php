<?php
// announcements.php - Handle announcements display
// This script retrieves and displays announcements

require_once 'auth.php';
require_once 'db.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all announcements
    $announcements = getMultipleRows(
        "SELECT * FROM announcements ORDER BY created_at DESC"
    );

    header('Content-Type: application/json');
    echo json_encode($announcements);
}
?>
