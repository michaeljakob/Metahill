<?php

require_once('db-interface.php');
$dbh = getDBH();

/////////////////////////////////////////////////////////////
// incoming values
/////////////////////////////////////////////////////////////
$roomName = $_POST['name'];
$roomOwner = $_POST['owner'];
$roomTopic = $_POST['topic'];
$roomPassword = $_POST['password']; // if no password set it is empty string
if($roomPassword === "") {
    $roomPassword = null;
}

$success = true;

/////////////////////////////////////////////////////////////
// create room 
/////////////////////////////////////////////////////////////
$statement = $dbh->prepare('INSERT INTO rooms (`name`, `owner`, `topic`, `password`)
                            VALUES (:name, :owner, :topic, :password)');

$param = array( ':name' => $roomName, 
                ':owner' => $roomOwner,
                ':topic' => $roomTopic,
                ':password' => $roomPassword);

$success &= $statement->execute($param);

/////////////////////////////////////////////////////////////
// return some sign of life
/////////////////////////////////////////////////////////////
if($success) {
    header('Status: 200 OK', true, 200);
    header('Content-Description: ' . $dbh->lastInsertId() );
} else {
    header('Status: 400 Bad Request', true, 400);
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}






