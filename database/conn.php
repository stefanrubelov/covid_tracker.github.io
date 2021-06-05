<?php
require_once __DIR__ . "/../autoload.php";
try {
    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
} catch (PDOException $e) {
    echo "Database connection error. Please try again later.";
    die();
}
