<?php

require_once('db-interface.php');
$dbh = getDBH();

$roomTopic = $_POST['roomTopic'];
$roomId = $_POST['roomId'];

$query =   'UPDATE `rooms`
            SET topic=:room_topic
            WHERE id=:room_id';


$statement = $dbh->prepare($query);
$success = $statement->execute(array(':room_topic' => $roomTopic, ':room_id' => $roomId));

// if($success) {
//     header('Status: 200 OK');
// } else {
//     header('Status: 400 Bad Request');
//     header('Content-Description: ' . var_dump($statement->errorInfo()));
// }







