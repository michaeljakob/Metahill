<?php

    if(!isset($_POST['room'])) {
        exit();
    }

    require_once("../../php/db-interface.php");

    $roomName = $_POST['room'];
    $room = dbGetRoomObjectFromName($roomName);
    echo json_encode($room);