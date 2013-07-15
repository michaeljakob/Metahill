<?php

require_once('db-interface.php');
$dbh = getDBH();

$userId = $_POST['userId'];
$roomId = $_POST['roomId'];
$roomPosition = $_POST['position'];

$query = 'UPDATE `favorite_rooms`
           SET position=position-1
           WHERE account_id=:user_id AND position>:position;'; 
$query .= 'DELETE FROM `favorite_rooms` WHERE account_id=:user_id AND room_id=:room_id;';


$statement = $dbh->prepare($query);
$success = $statement->execute(array(':user_id' => $userId, ':room_id' => $roomId, ':position' => $roomPosition));

if($success) {
    header('Status: 200 OK');
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







