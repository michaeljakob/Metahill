<?php

require_once('db-interface.php');
$dbh = getDBH();

$name = $_POST['roomname'];

if(dbRoomExists($name)) {
    header('Content-Description: 1');
} else {
    header('Content-Description: 0');
}











