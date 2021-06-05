<?php
require_once "../../autoload.php";

$countriesData = file_get_contents("https://api.covid19api.com/countries");
$countriesData = json_decode($countriesData, true);

$rows = mysqli_query(mysqli_connect("localhost", "root", "", $dbname), "SELECT * FROM countries");
$rows = mysqli_num_rows($rows);

$sql = "INSERT INTO countries(`name`, `slug`) VALUES(:name, :slug)";
$stmt = $conn->prepare($sql);
$stmt->bindParam("name", $name);
$stmt->bindParam("slug", $slug);

if ($rows == 0) {
    foreach ($countriesData as $key) {
        $name = $key['Country'];
        $slug = $key['Slug'];
        $stmt->execute();
    }
    echo "the countries have been set!!!1!";
} else {
    echo "countries are set";
}
