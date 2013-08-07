<?php
    
    $info = pathinfo($_FILES['file']['name']);
    $fileSize = $_FILES['file']['size'];
    if($fileSize > 5 * 1000 * 1000) {
        header('Status: 413 Request Entity Too Large', true, 413);
        die();
    }

    $imageSize = getimagesize($_FILES['file']['tmp_name']);
    if($imageSize[0] != 0 && $imageSize[1] != 0) {
        $userName = '_';
        if(isset($_POST['userName'])) {
            $userName = $_POST['userName'];
        }


        $ext = $info['extension']; 
        $fileId = substr(sha1(round(microtime(true))), 0, 20);
        $newName = $userName . '.' . $fileId . '.' . $ext;
        $target = "image-upload/$newName";
        
        move_uploaded_file($_FILES['file']['tmp_name'], '../' . $target);
        
        header('Status: 200 OK');
        header('Content-Description: ' . $target);
    } else {
        header('Status: 415 Unsupported Media Type', true, 415);
    }

    
    
    
    