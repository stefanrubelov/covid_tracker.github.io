<?php
require_once "../autoload.php";

$sql =
    selectQuery(
        $conn,
        "SELECT 
            `cases`.`country`,
            `cases`.`confirmed` as 'total_confirmed',
            `cases`.`new confirmed` as 'confirmed_new',
            `cases`.`deaths` as 'total_deaths',
            `cases`.`new deaths` as 'deaths_new',
            `cases`.`recovered` as 'total_recovered',
            `cases`.`new recovered` as 'recovered_new',
            `cases`.`active` as `active`
        FROM
            cases
        WHERE 
            date = (SELECT MAX(date) FROM cases)
        GROUP BY
            `country`"
    );

echo json_encode($sql);
