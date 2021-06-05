<?php
require_once "../autoload.php";

if (isset($_POST["country"])) {
    $country = $_POST["country"];
    $country = '"' . $country . '"';
} else {
    echo "Something went wrong";
    die();
}
// dd($country);
$sql = selectQuery(
    $conn,
    "SELECT 
        `cases`.`country`,
        `cases`.`confirmed` as 'total_confirmed',
        `cases`.`new confirmed` as 'confirmed_new' ,
        `cases`.`deaths` as 'total_deaths',
        `cases`.`new deaths` as 'deaths_new',
        `cases`.`recovered` as 'total_recovered',
        `cases`.`new recovered` as 'recovered_new',
        `cases`.`active` as 'active',
        `cases`.`date` as 'date'
    FROM 
        `cases`
    WHERE 
        `country` = $country
    ORDER BY
        `date` ASC
    "
);
echo json_encode($sql);
// echo $name;
