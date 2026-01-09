<?php
// timetable.php - Handle timetable operations
// This script handles CRUD operations for student timetable

require_once 'auth.php';
require_once 'db.php';

requireLogin();

$student_id = getCurrentUserId();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all timetable entries for the student
    $timetable = getMultipleRows(
        "SELECT * FROM timetable WHERE student_id = ? ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time",
        [$student_id],
        "i"
    );

    header('Content-Type: application/json');
    echo json_encode($timetable);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new timetable entry
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $faculty = sanitizeInput($_POST['faculty'] ?? '');
    $day = $_POST['day'] ?? '';
    $start_time = $_POST['start_time'] ?? '';
    $end_time = $_POST['end_time'] ?? '';
    $room = sanitizeInput($_POST['room'] ?? '');

    if (empty($subject) || empty($faculty) || empty($day) || empty($start_time) || empty($end_time) || empty($room)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }

    $result = executeNonQuery(
        "INSERT INTO timetable (student_id, subject, faculty, day, start_time, end_time, room) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [$student_id, $subject, $faculty, $day, $start_time, $end_time, $room],
        "issssss"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Timetable entry added successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add timetable entry']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update timetable entry
    parse_str(file_get_contents("php://input"), $_PUT);

    $id = $_PUT['id'] ?? '';
    $subject = sanitizeInput($_PUT['subject'] ?? '');
    $faculty = sanitizeInput($_PUT['faculty'] ?? '');
    $day = $_PUT['day'] ?? '';
    $start_time = $_PUT['start_time'] ?? '';
    $end_time = $_PUT['end_time'] ?? '';
    $room = sanitizeInput($_PUT['room'] ?? '');

    if (empty($id) || empty($subject) || empty($faculty) || empty($day) || empty($start_time) || empty($end_time) || empty($room)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }

    $result = executeNonQuery(
        "UPDATE timetable SET subject = ?, faculty = ?, day = ?, start_time = ?, end_time = ?, room = ? WHERE id = ? AND student_id = ?",
        [$subject, $faculty, $day, $start_time, $end_time, $room, $id, $student_id],
        "ssssssii"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Timetable entry updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update timetable entry']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete timetable entry
    parse_str(file_get_contents("php://input"), $_DELETE);

    $id = $_DELETE['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        exit();
    }

    $result = executeNonQuery(
        "DELETE FROM timetable WHERE id = ? AND student_id = ?",
        [$id, $student_id],
        "ii"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Timetable entry deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete timetable entry']);
    }
}
?>
