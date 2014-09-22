<?php

require_once('db-interface.php');
$dbh = getDBH();
$success = false;

$roomTopic = $_POST['roomTopic'];
$roomId = $_POST['roomId'];
$roomNewPassword = $_POST['roomNewPassword'];
$roomAdmins = explode(',', $_POST['roomAdmins']); // room admins without owner
$userId = $_POST['userId'];
$userName = $_POST['userName'];
$userPassword = $_POST['userPassword'];

$sqlParameters = array(
    ':room_topic' => $roomTopic, 
    ':room_id' => $roomId, 
    ':user_id' => $userId, 
    ':user_password' => $userPassword,
    ':room_password' => $roomNewPassword);


// dbGetRoomObjectFromId($roomId)->owner != $userId
$room = dbGetRoomObjectFromId($roomId);
header('Status: 200 OK');
if(gettype(dbVerifyLogin($userName, $userPassword)) !== "string" || $room == null || $room->owner != $userId) {
    header('Content-Description: 0');
    exit();
}

$updatePassword = $roomNewPassword != '';

// update topic & pass
$query =   'UPDATE `rooms`
            SET topic=:room_topic ';

if($updatePassword) {
    $query .= ',password=:room_password ';
}

$query .=   'WHERE id=:room_id AND
            (owner=:user_id OR (SELECT true FROM `room_admins` WHERE account_id=:user_id AND room_id=:room_id));';


$statement = $dbh->prepare($query);
$statement->execute($sqlParameters);

// update admins 
$userNotFound = null;
if(count($roomAdmins) >= 1) {
    $query .=    'DELETE FROM `room_admins` WHERE room_id=:room_id;';

    foreach($roomAdmins as &$admin) {
        $user = dbGetUserObject(trim($admin));
        if($user != null) {
            $userId = $user->id;
            $query .= 'INSERT INTO `room_admins`(`account_id`, `room_id`) VALUES ('.$userId.', :room_id);';
        } else {
            $userNotFound = $admin;
        }
    }
}

$statement = $dbh->prepare($query);
$statement->execute($sqlParameters);

if($userNotFound !== null) {
    header('Content-Description: ' . $userNotFound);
} else {
    header('Content-Description: 1');
}










