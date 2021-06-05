<?php
require_once "../autoload.php";

$sql =
    selectQuery(
        $conn,
        "SELECT 
            SUM(`cases`.`new confirmed`) as 'total_confirmed',
            SUM(`cases`.`new deaths`) as 'total_deaths',
            SUM(`cases`.`new recovered`) as 'total_recovered',
            `cases`.`date` as 'date'
        FROM 
            `cases`
        GROUP BY 
            `date`  
        ORDER BY 
            `cases`.`date` 
        ASC"
    );

echo json_encode($sql);


// $sql =
//     selectQuery(
//         $conn,
//         "SELECT 
//             `cases`.`confirmed` as 'total_confirmed',
//             `cases`.`deaths` as 'total_deaths',
//             `cases`.`recovered` as 'total_recovered',
//             `cases`.`date` as 'date'
//         FROM 
//             `cases`
//         GROUP BY 
//             `date`
//         ORDER BY 
//             `cases`.`date`
//         ASC"
//     );

// echo json_encode($sql);
