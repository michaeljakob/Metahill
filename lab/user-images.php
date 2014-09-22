<?php

    if(!isset($_GET['username'])) {
        exit("No username supplied");
    }

    $username = basename($_GET['username']);
    $files = glob("../image-upload/$username.*");
    foreach($files as $file) {
        echo "<img src='$file'/>";
    }
