<?php
// login.php - Handle user login
// This script processes login form submissions

require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Basic validation
    if (empty($email) || empty($password)) {
        $error = "Please fill in all fields.";
    } elseif (!isValidEmail($email)) {
        $error = "Please enter a valid email address.";
    } else {
        // Attempt login
        if (loginUser($email, $password)) {
            header('Location: ../dashboard.html');
            exit();
        } else {
            $error = "Invalid email or password.";
        }
    }
}

// If GET request or error, redirect back to login page with error
if (isset($error)) {
    header('Location: ../login.html?error=' . urlencode($error));
} else {
    header('Location: ../login.html');
}
exit();
?>
