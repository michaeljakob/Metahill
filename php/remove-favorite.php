<?php

require_once('db-interface.php');
$dbh = getDBH();

$userId = $_POST['userId'];
$roomId = $_POST['roomId'];

// get the position of the room to be removed
$query = "SELECT position FROM `favorite_rooms` WHERE account_id=:user_id AND room_id=:room_id;";
$statement = $dbh->prepare($query);
$success = $statement->execute(array(':user_id' => $userId, ':room_id' => $roomId));
$roomPosition = $statement->fetch(PDO::FETCH_OBJ)->position;

// decrease following room ids by one, remove the entry
$query =  'UPDATE `favorite_rooms`
           SET position=position-1
           WHERE account_id=:user_id AND position>:position;'; 
$query .= 'DELETE FROM `favorite_rooms` WHERE account_id=:user_id AND room_id=:room_id;';


$statement = $dbh->prepare($query);
$success = $statement->execute(array(':user_id' => $userId, ':room_id' => $roomId, ':position' => $roomPosition));

if($success) {
    header('Status: 200 OK');
} else {
    header('Status: 400 Bad Request', true, 400);
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







