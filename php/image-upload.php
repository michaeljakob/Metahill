<?php
    
    $submissionType = $_POST['submissionType'];
    $userName = '_';
    if(isset($_POST['userName'])) {
        $userName = $_POST['userName'];
    }


    // is it a valid image?
    $imageSize = getimagesize($_FILES['file']['tmp_name']);
    if($imageSize[0] == 0 || $imageSize[1] == 0) {
        header('Status: 415 Unsupported Media Type [drag]', true, 415);
        exit();
    }

    // generate new name
    $path = $_FILES['file']['name'];
    $ext = $_POST['extension'];
    $fileId = substr(sha1(round(microtime(true))), 0, 20);
    $newName = "$userName.$fileId.$ext";
    $target = "image-upload/$newName";
    
    switch($submissionType) {
        case 'drag':
            $fileSize = $_FILES['file']['size'];
            if($fileSize > 5 * 1000 * 1000) {
                header('Status: 413 Request Entity Too Large', true, 413);
                die();
            }

            move_uploaded_file($_FILES['file']['tmp_name'], "../$target");
            
            header('Status: 200 OK', true, 200);
            header('Content-Description: ' . $target);
            break;
        case 'paste':
            if( isset( $_FILES['file'] ) ) {
                $file_contents = file_get_contents( $_FILES['file']['tmp_name'] );
                file_put_contents("../$target", $file_contents);
                header('Status: 200 OK', true, 200);
                header('Content-Description: ' . $target);
            } else {
                header('Status: 415 Unsupported Media Type [paste]', true, 415);
            }
            break;
    }

    
    