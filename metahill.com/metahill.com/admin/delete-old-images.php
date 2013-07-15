<?php


    $files = glob('../image-upload/*');
    foreach($files as $file) {
        // older than 5 days
        if(is_file($file) && time() - filemtime($file) >= 5*24*60*60) {
            unlink($file);
        }
    }

    echo 'success';


