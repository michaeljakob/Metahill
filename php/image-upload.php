<?php
    
    $info = pathinfo($_FILES['file']['name']);
    $fileSize = $_FILES['file']['size'];
    if($fileSize > 5 * 1000 * 1000) {
        header('Status: 413 Request Entity Too Large');
        die();
    }

    $userName = '_';
    if(isset($_POST['userName'])) {
        $userName = $_POST['userName'];
    }


    $ext = $info['extension']; 
    $newName = $userName . '.' . round(microtime(true)) . '.' . $ext;
    $target = "image-upload/$newName";
    
    move_uploaded_file($_FILES['file']['tmp_name'], '../' . $target);
    
    header('Status: 200 OK');
    header('Content-Description: ' . $target);
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    