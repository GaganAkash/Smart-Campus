<?php
// logout.php - Handle user logout
// This script logs out the user and redirects to login page

require_once 'auth.php';

logoutUser();
header('Location: ../login.html?message=' . urlencode('You have been logged out successfully.'));
exit();
?>
