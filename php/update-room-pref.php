<?php

require_once('db-interface.php');
$dbh = getDBH();

$roomTopic = $_POST['roomTopic'];
$roomId = $_POST['roomId'];
$userId = $_POST['userId'];
$userPassword = $_POST['userPassword'];

$query =   'UPDATE `rooms`
            SET topic=:room_topic
            WHERE id=:room_id AND owner=:user_id AND (SELECT true FROM `accounts` WHERE id=:user_id and password=:user_password)';


$statement = $dbh->prepare($query);
$success = $statement->execute(array(':room_topic' => $roomTopic, ':room_id' => $roomId, ':user_id' => $userId, ':user_password' => $userPassword));

if($success) {
    header('Status: 200 OK');
    header('Content-Description: ' . $statement->rowCount());
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







