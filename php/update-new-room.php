<?php

require_once('db-interface.php');
$dbh = getDBH();

/////////////////////////////////////////////////////////////
// incoming values
/////////////////////////////////////////////////////////////
$roomName = $_POST['name'];
$roomOwner = $_POST['owner'];
$roomTopic = $_POST['topic'];


$success = true;

/////////////////////////////////////////////////////////////
// create room 
/////////////////////////////////////////////////////////////
$statement = $dbh->prepare('INSERT INTO rooms (`name`, `owner`, `topic`)
                            VALUES (:name, :owner, :topic)');

$param = array( ':name' => $roomName, 
                ':owner' => $roomOwner,
                ':topic' => $roomTopic);

$success &= $statement->execute($param);

/////////////////////////////////////////////////////////////
// return some sign of life
/////////////////////////////////////////////////////////////
if($success) {
    header('Status: 200 OK');
    header('Content-Description: ' . $dbh->lastInsertId() );
} else {
    header('Status: 400 Bad Request', true, 400);
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}






