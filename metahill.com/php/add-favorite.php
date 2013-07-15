<?php

require_once('db-interface.php');
$dbh = getDBH();

$userId = $_POST['userId'];
$roomId = $_POST['roomId'];
$position = $_POST['position'];

$query =   'INSERT INTO `favorite_rooms`(`account_id`, `room_id`, `position`) 
            VALUES (:user_id, :room_id, :position)';
$statement = $dbh->prepare($query);
$success = $statement->execute(array(':user_id' => $userId, ':room_id' => $roomId, ':position' => $position));

if($success) {
    header('Status: 200 OK');
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







