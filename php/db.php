<?php
// db.php - Database connection and utility functions
// This file handles database connections and provides utility functions

require_once 'config.php';

// Create database connection
function getDBConnection() {
    static $conn = null;

    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $conn->set_charset("utf8");
    }

    return $conn;
}

// Execute a prepared statement and return result
function executeQuery($sql, $params = [], $types = '') {
    $conn = getDBConnection();
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    return $stmt;
}

// Get single row from query
function getSingleRow($sql, $params = [], $types = '') {
    $stmt = executeQuery($sql, $params, $types);
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    return $row;
}

// Get multiple rows from query
function getMultipleRows($sql, $params = [], $types = '') {
    $stmt = executeQuery($sql, $params, $types);
    $result = $stmt->get_result();
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $rows;
}

// Execute non-select query (INSERT, UPDATE, DELETE)
function executeNonQuery($sql, $params = [], $types = '') {
    $stmt = executeQuery($sql, $params, $types);
    $affectedRows = $stmt->affected_rows;
    $stmt->close();
    return $affectedRows;
}

// Close database connection
function closeDBConnection() {
    $conn = getDBConnection();
    $conn->close();
}
?>
