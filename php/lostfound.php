<?php
// lostfound.php - Handle lost and found operations
// This script handles CRUD operations for lost and found items

require_once 'auth.php';
require_once 'db.php';

requireLogin();

$student_id = getCurrentUserId();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all lost and found items
    $items = getMultipleRows(
        "SELECT lf.*, s.name as posted_by FROM lost_found lf LEFT JOIN students s ON lf.student_id = s.id ORDER BY lf.created_at DESC"
    );

    header('Content-Type: application/json');
    echo json_encode($items);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new lost/found item
    $type = $_POST['type'] ?? '';
    $item_name = sanitizeInput($_POST['item_name'] ?? '');
    $description = sanitizeInput($_POST['description'] ?? '');
    $contact_details = sanitizeInput($_POST['contact_details'] ?? '');

    if (empty($type) || empty($item_name) || empty($description) || empty($contact_details)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }

    if (!in_array($type, ['lost', 'found'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
        exit();
    }

    $result = executeNonQuery(
        "INSERT INTO lost_found (type, item_name, description, contact_details, student_id) VALUES (?, ?, ?, ?, ?)",
        [$type, $item_name, $description, $contact_details, $student_id],
        "ssssi"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Item posted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to post item']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete lost/found item (only if posted by current user)
    parse_str(file_get_contents("php://input"), $_DELETE);

    $id = $_DELETE['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit();
    }

    $result = executeNonQuery(
        "DELETE FROM lost_found WHERE id = ? AND student_id = ?",
        [$id, $student_id],
        "ii"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Item deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete item or item not found']);
    }
}
?>
