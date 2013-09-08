<?php

    if(!isset($_POST['room'])) {
        exit();
    }

    require_once("../../php/db-interface.php");

    $roomName = $_POST['room'];
    $roomPassword = $_POST['password'];
    $room = dbGetRoomObjectFromName($roomName);
    if($room->password === $roomPassword) {
        echo "1";
    } else {
        echo "0";
    }
