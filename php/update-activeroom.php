<?php

require_once('db-interface.php');
$dbh = getDBH();

$userId = $_POST['userId'];
$activeRoom = $_POST['activeRoom'];

$query =   'UPDATE `accounts`
            SET activeRoom=:active_room
            WHERE id=:user_id;';
$statement = $dbh->prepare($query);
$success = $statement->execute(array(':user_id' => $userId, ':active_room' => $activeRoom));



if($success) {
    header('Status: 200 OK');
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







