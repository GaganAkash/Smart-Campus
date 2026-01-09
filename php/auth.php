<?php
// auth.php - Authentication utility functions
// This file contains functions for user authentication, session management, and security

session_start();

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['student_id']);
}

// Get current user ID
function getCurrentUserId() {
    return $_SESSION['student_id'] ?? null;
}

// Get current user data
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }

    require_once 'db.php';
    return getSingleRow("SELECT id, name, usn, email FROM students WHERE id = ?", [getCurrentUserId()], "i");
}

// Login user
function loginUser($email, $password) {
    require_once 'db.php';

    $user = getSingleRow("SELECT id, name, password FROM students WHERE email = ?", [$email], "s");

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['student_id'] = $user['id'];
        $_SESSION['student_name'] = $user['name'];
        return true;
    }

    return false;
}

// Logout user
function logoutUser() {
    session_destroy();
    session_start();
}

// Redirect if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: ../login.html');
        exit();
    }
}

// Sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF token
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>
