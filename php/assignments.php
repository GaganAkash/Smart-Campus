<?php
// assignments.php - Handle assignment operations
// This script handles CRUD operations for student assignments

require_once 'auth.php';
require_once 'db.php';

requireLogin();

$student_id = getCurrentUserId();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all assignments for the student
    $assignments = getMultipleRows(
        "SELECT * FROM assignments WHERE student_id = ? ORDER BY due_date ASC",
        [$student_id],
        "i"
    );

    header('Content-Type: application/json');
    echo json_encode($assignments);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new assignment
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $description = sanitizeInput($_POST['description'] ?? '');
    $due_date = $_POST['due_date'] ?? '';

    if (empty($subject) || empty($description) || empty($due_date)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }

    $result = executeNonQuery(
        "INSERT INTO assignments (student_id, subject, description, due_date) VALUES (?, ?, ?, ?)",
        [$student_id, $subject, $description, $due_date],
        "isss"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Assignment added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add assignment']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update assignment (mark as completed or edit details)
    parse_str(file_get_contents("php://input"), $_PUT);

    $id = $_PUT['id'] ?? '';
    $completed = isset($_PUT['completed']) ? (int)$_PUT['completed'] : null;

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit();
    }

    if ($completed !== null) {
        // Mark as completed/incomplete
        $result = executeNonQuery(
            "UPDATE assignments SET completed = ? WHERE id = ? AND student_id = ?",
            [$completed, $id, $student_id],
            "iii"
        );
    } else {
        // Update other details
        $subject = sanitizeInput($_PUT['subject'] ?? '');
        $description = sanitizeInput($_PUT['description'] ?? '');
        $due_date = $_PUT['due_date'] ?? '';

        if (empty($subject) || empty($description) || empty($due_date)) {
            http_response_code(400);
            echo json_encode(['error' => 'All fields are required']);
            exit();
        }

        $result = executeNonQuery(
            "UPDATE assignments SET subject = ?, description = ?, due_date = ? WHERE id = ? AND student_id = ?",
            [$subject, $description, $due_date, $id, $student_id],
            "sssii"
        );
    }

    if ($result > 0) {
        echo json_encode(['success' => 'Assignment updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update assignment']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete assignment
    parse_str(file_get_contents("php://input"), $_DELETE);

    $id = $_DELETE['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit();
    }

    $result = executeNonQuery(
        "DELETE FROM assignments WHERE id = ? AND student_id = ?",
        [$id, $student_id],
        "ii"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Assignment deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete assignment']);
    }
}
?>
