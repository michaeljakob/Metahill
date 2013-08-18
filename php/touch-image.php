<?php

    if(!isset($_POST['image'])) {
        exit();
    }

    $image = htmlspecialchars(basename($_POST['image']));

    $s = false;
    if(file_exists("../image-upload/$image")) {
        $s = touch("../image-upload/$image");
    }

    header("Status: 200 OK", true, 200);
    header("Content-Description: $image > $s");