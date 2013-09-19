<?php
    session_start();
    session_regenerate_id(true);


    // generate guest name
    $guestName = "Guest";
    for($i = 0; $i < 4; ++$i) {
        $guestName .= (string) rand(1, 9);
    }

    $_SESSION['logged_in'] = true;
    $_SESSION['verified'] = true;
    $_SESSION['name'] = $guestName;

    if(isset($_POST["source"])) {
        header("Location: {$_POST['source']}");
    } else {
        header("Location: index.php?{$_SERVER['QUERY_STRING']}");
    }
?>