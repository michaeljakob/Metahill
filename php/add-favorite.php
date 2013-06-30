<?php

require_once('db-interface.php');
$dbh = getDBH();

$userId = $_POST['userId'];
$roomId = $_POST['roomId'];

$query = 'INSERT INTO `favorite_rooms`(`account_id`, `room_id`) VALUES (:user_id, :room_id);';


$statement = $dbh->prepare($query);
$success = $statement->execute(array(':user_id' => $userId, ':room_id' => $roomId));

// if($success) {
//     header('Status: 200 OK');
// } else {
//     header('Status: 400 Bad Request');
//     header('Content-Description: ' . var_dump($statement->errorInfo()));
// }







