<?php
require_once "../autoload.php";

$sql =
    selectQuery(
        $conn,
        "SELECT 
            `cases`.`country`, 
            MAX(`cases`.`confirmed`) as 'total_confirmed', 
            SUM(`cases`.`new confirmed`) as 'confirmed_new', 
            MAX(`cases`.`deaths`) as 'total_deaths', 
            SUM(`cases`.`new deaths`) as 'deaths_new', 
            MAX(`cases`.`recovered`) as 'total_recovered', 
            SUM(`cases`.`new recovered`) as 'recovered_new',
            `cases`.`active` as 'active'
        FROM 
            cases 
        WHERE 
            date 
        BETWEEN 
            ((SELECT MAX(date) FROM cases) - INTERVAL 1 MONTH) 
        AND 
            (SELECT MAX(date) FROM cases) 
        GROUP BY 
            `country`"
    );

echo json_encode($sql);
