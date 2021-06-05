<?php
require_once __DIR__ . "/../autoload.php";
//edit dbname, dbuser and db password in config/consts.php
try {
    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
} catch (PDOException $e) {
    echo "Database connection error. Please try again later.";
    die();
}
