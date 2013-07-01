<?php

require_once('db-interface.php');
$dbh = getDBH();

$intent = $_POST["intent"];
$userId = $_POST["userId"];
$currentPassword = $_POST["currentPassword"];

$success = false;
$statement;
switch($intent) {
    case 'delete-account':
        $query = "DELETE FROM `accounts` WHERE id=:user_id AND password=:password;";
        $statement = $dbh->prepare($query);
        $success = $statement->execute(array(':user_id' => $userId, ':password' => $currentPassword));
        break;
    case 'change-password':
        $newPassword = $_POST["newPassword"];

        $query = "UPDATE `accounts` SET password=:new_password WHERE id=:user_id AND password=:password;";
        $statement = $dbh->prepare($query);
        $success = $statement->execute(array(':user_id' => $userId, ':new_password' => $newPassword, ':password' => $currentPassword));
        break;
    default:
        echo "invalid intent";
}

if($success) {
    header('Status: 200 OK');
    header('Content-Description: ' . $intent . '>' . $statement->rowCount());
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}







