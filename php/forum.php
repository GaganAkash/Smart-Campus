<?php
// forum.php - Handle doubt forum operations
// This script handles posting and retrieving anonymous questions

require_once 'auth.php';
require_once 'db.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all forum questions
    $questions = getMultipleRows(
        "SELECT * FROM forum ORDER BY created_at DESC"
    );

    header('Content-Type: application/json');
    echo json_encode($questions);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new question (anonymous)
    $question = sanitizeInput($_POST['question'] ?? '');

    if (empty($question)) {
        http_response_code(400);
        echo json_encode(['error' => 'Question cannot be empty']);
        exit();
    }

    $result = executeNonQuery(
        "INSERT INTO forum (question) VALUES (?)",
        [$question],
        "s"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Question posted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to post question']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete question (admin functionality - simplified, in real app would check admin role)
    parse_str(file_get_contents("php://input"), $_DELETE);

    $id = $_DELETE['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit();
    }

    $result = executeNonQuery(
        "DELETE FROM forum WHERE id = ?",
        [$id],
        "i"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Question deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete question']);
    }
}
?>
