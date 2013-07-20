<?php

require_once('db-interface.php');
$dbh = getDBH();

$userId = $_POST['userId'];
$roomId = $_POST['roomId'];
$startPosition = $_POST['startPosition'];
$endPosition = $_POST['endPosition'];

$query =   'UPDATE `favorite_rooms`
            SET position=:end_position
            WHERE account_id=:user_id AND position=:start_position;';

if($startPosition > $endPosition) {
    $query .=  'UPDATE `favorite_rooms`
                SET position=position+1
                WHERE account_id=:user_id AND position >= :end_position AND position < :start_position AND room_id != :room_id;';

} else {
    // $endPosition > $startPosition
    $query .=  'UPDATE `favorite_rooms`
                SET position=position-1
                WHERE account_id=:user_id AND position > :start_position AND position <= :end_position AND room_id != :room_id;';
}



$statement = $dbh->prepare($query);
$success = $statement->execute(
    array(':user_id' => $userId, ':room_id' => $roomId, ':start_position' => $startPosition, ':end_position' => $endPosition));

if($success) {
    header('Status: 200 OK');
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







