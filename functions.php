<?php

function selectQuery($pdo, $sql)
{
    $stmt = $pdo->query($sql);
    $data = [];
    while ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($data, $user);
    }
    return $data;
}

function dd($variable)
{
    echo '<pre>';
    die(var_dump($variable));
    echo '</pre>';
}
