<?php

    if(!isset($_GET['image'])) {
        exit();
    }

    $image = htmlspecialchars(basename($_GET['image']));

    if(file_exists("../image-upload/$image")) {
        touch("../image-upload/$image");
    }