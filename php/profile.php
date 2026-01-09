<?php
// profile.php - Handle profile operations
// This script handles viewing and updating student profile information

require_once 'auth.php';
require_once 'db.php';

requireLogin();

$student_id = getCurrentUserId();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get current user profile
    $user = getCurrentUser();

    if ($user) {
        header('Content-Type: application/json');
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update profile information
    parse_str(file_get_contents("php://input"), $_PUT);

    $name = sanitizeInput($_PUT['name'] ?? '');
    $usn = sanitizeInput($_PUT['usn'] ?? '');
    $email = sanitizeInput($_PUT['email'] ?? '');

    if (empty($name) || empty($usn) || empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }

    if (!isValidEmail($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit();
    }

    // Check if email or USN already exists (excluding current user)
    $existing_user = getSingleRow(
        "SELECT id FROM students WHERE (email = ? OR usn = ?) AND id != ?",
        [$email, $usn, $student_id],
        "ssi"
    );

    if ($existing_user) {
        http_response_code(400);
        echo json_encode(['error' => 'Email or USN already exists']);
        exit();
    }

    $result = executeNonQuery(
        "UPDATE students SET name = ?, usn = ?, email = ? WHERE id = ?",
        [$name, $usn, $email, $student_id],
        "sssi"
    );

    if ($result > 0) {
        // Update session data
        $_SESSION['student_name'] = $name;
        echo json_encode(['success' => 'Profile updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update profile']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    // Change password
    parse_str(file_get_contents("php://input"), $_PATCH);

    $current_password = $_PATCH['current_password'] ?? '';
    $new_password = $_PATCH['new_password'] ?? '';
    $confirm_password = $_PATCH['confirm_password'] ?? '';

    if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
        http_response_code(400);
        echo json_encode(['error' => 'All password fields are required']);
        exit();
    }

    if (strlen($new_password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'New password must be at least 6 characters long']);
        exit();
    }

    if ($new_password !== $confirm_password) {
        http_response_code(400);
        echo json_encode(['error' => 'New passwords do not match']);
        exit();
    }

    // Verify current password
    $user = getSingleRow("SELECT password FROM students WHERE id = ?", [$student_id], "i");

    if (!$user || !password_verify($current_password, $user['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Current password is incorrect']);
        exit();
    }

    // Update password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    $result = executeNonQuery(
        "UPDATE students SET password = ? WHERE id = ?",
        [$hashed_password, $student_id],
        "si"
    );

    if ($result > 0) {
        echo json_encode(['success' => 'Password changed successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to change password']);
    }
}
?>
