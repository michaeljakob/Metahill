<?php

    if(!isset($_POST['roomId'])) {
        exit();
    }


    $roomId = $_POST['roomId'];

    $includeOwner = true;
    if(isset($_POST['includeOwner'])) {
        $includeOwner = $_POST['includeOwner'] === 'true';
    }

    require_once("../../php/db-interface.php");

    $admins = dbGetRoomAdmins($roomId, $includeOwner);
    $names = array();

    for($i=0; $i<count($admins); ++$i) {
        array_push($names, dbGetUserName($admins[$i]));
    }

    echo implode(',', $names);