<?php
require_once "../../autoload.php";
error_reporting(0);
set_time_limit(0);

$lastDateInDB = selectQuery($conn, "SELECT (MAX(date)) as lastDateInDB FROM cases LIMIT 1");
$lastDateInDB = $lastDateInDB[0]["lastDateInDB"];
$currentDate = date("Y-m-d");
$currentDateMinusOneDay = date('Y-m-d', (strtotime('-1 day', strtotime($currentDate))));
$sql = "SELECT slug FROM countries";
$stmt = $conn->query($sql);

if ($lastDateInDB == $currentDate || $lastDateInDB == $currentDateMinusOneDay) {
    sleep(3);
    header("Location: ../../index.html");
    die();
} else {
    foreach ($conn->query($sql) as $country) {
        // $data = file_get_contents("https://api.covid19api.com/total/country/{$country['slug']}?from=2020-12-31&to=$currentDate");
        $data = file_get_contents("https://api.covid19api.com/total/country/{$country['slug']}?from={$lastDateInDB}&to={$currentDate}");
        $data = json_decode($data, true);

        if (!empty($data)) {

            for ($i = 1; $i < count($data); $i++) {
                $country = $data[$i]["Country"];
                $confirmed = $data[$i]["Confirmed"];
                $newConfirmed = $data[$i]["Confirmed"] - $data[$i - 1]["Confirmed"];
                $deaths = $data[$i]["Deaths"];
                $newDeaths = $data[$i]["Deaths"] - $data[$i - 1]["Deaths"];
                $recovered = $data[$i]["Recovered"];
                $newRecovered = $data[$i]["Recovered"] - $data[$i - 1]["Recovered"];
                $active = $data[$i]["Active"];
                $date = $data[$i]["Date"];
                $date = substr($date, 0, -10);

                $values = '("' . $country . '", ' . $confirmed . ', '  . $newConfirmed . ', ' . $deaths . ', ' . $newDeaths . ', ' . $recovered . ', ' . $newRecovered . ', ' . $active . ', "' . $date . '")';

                $sql = "INSERT INTO `cases`(`country`, `confirmed`, `new confirmed`, `deaths`, `new deaths`, `recovered`, `new recovered`, `active`, `date`) 
                                        VALUES $values";
                $stmtInsertCases = $conn->prepare($sql);
                $stmtInsertCases->bindParam('country', $country);
                $stmtInsertCases->bindParam('confirmed', $confirmed);
                $stmtInsertCases->bindParam('new confirmed', $newConfirmed);
                $stmtInsertCases->bindParam('deaths', $deaths);
                $stmtInsertCases->bindParam('new deaths', $newDeaths);
                $stmtInsertCases->bindParam('recovered', $recovered);
                $stmtInsertCases->bindParam('new recovered', $newRecovered);
                $stmtInsertCases->bindParam('active', $active);
                $stmtInsertCases->bindParam('date', $date);
                $stmtInsertCases->execute();
            }
        }
        sleep(1);
    }
}

echo "The database has been updated with new information";
sleep(5);
header("Location: ../../index.html");
