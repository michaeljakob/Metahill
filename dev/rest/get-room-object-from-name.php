<?php

    if(!isset($_POST['room'])) {
        exit();
    }

    require_once("../../php/db-interface.php");



    $roomName = $_POST['room'];
    $room = dbGetRoomObjectFromName($roomName);

    // add "admins" property
    ini_set('display_errors', 0);
    if($room !== null) {
        $room->admins = implode(",", dbGetRoomAdmins($room->id));
    }

    echo json_encode($room);