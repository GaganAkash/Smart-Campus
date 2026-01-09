<?php
// register.php - Handle user registration
// This script processes registration form submissions

require_once 'auth.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitizeInput($_POST['name'] ?? '');
    $usn = sanitizeInput($_POST['usn'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Basic validation
    if (empty($name) || empty($usn) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = "Please fill in all fields.";
    } elseif (!isValidEmail($email)) {
        $error = "Please enter a valid email address.";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters long.";
    } elseif ($password !== $confirm_password) {
        $error = "Passwords do not match.";
    } else {
        // Check if email or USN already exists
        $existing_user = getSingleRow("SELECT id FROM students WHERE email = ? OR usn = ?", [$email, $usn], "ss");

        if ($existing_user) {
            $error = "Email or USN already exists.";
        } else {
            // Hash password and insert user
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            $result = executeNonQuery(
                "INSERT INTO students (name, usn, email, password) VALUES (?, ?, ?, ?)",
                [$name, $usn, $email, $hashed_password],
                "ssss"
            );

            if ($result > 0) {
                $success = "Registration successful! Please login.";
                header('Location: ../login.html?success=' . urlencode($success));
                exit();
            } else {
                $error = "Registration failed. Please try again.";
            }
        }
    }
}

// If GET request or error, redirect back to register page with error
if (isset($error)) {
    header('Location: ../register.html?error=' . urlencode($error));
} else {
    header('Location: ../register.html');
}
exit();
?>
