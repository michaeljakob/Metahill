<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<base href="../" >
<?php
    require_once('feature/head.php'); 
?>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/log.css">
<link rel="stylesheet" type="text/css" href="css/chat.css">


</head>
<?php
    require_once('php/db-interface.php');

    $room = NULL;
    $roomExists = false;
    
    if(isset($_GET['room']) && strlen(trim($_GET['room'])) > 0) {
        $room = urldecode(str_replace('+', '%2B', urlencode($_GET['room'])));
        $roomExists = dbRoomExists($room);
    }


    function getRequestedTimeSpan() {
        if(isset($_GET['timespan']) && is_numeric($_GET['timespan'])) {
            $days = intval($_GET['timespan']);
            if($days > 0) {
                return $days;
            }
        }
        // default timespan is 3
        return 3;
    }
    
?>

<body>
    <?php require_once('feature/header.php'); ?>
    <section id="main-container" class="log-main-container">
    
        <?php
            if($room == NULL || !$roomExists) {
                echo    "<div class='alert alert-error'>
                            <h4>#?$1%(*&^%$#@</h4>
                            The requested room <i>$room</i> does not exist!
                        </div>";
            } else {
                $spanInDays = getRequestedTimeSpan();
                $viewingSpan;
                if($spanInDays >= 2) {
                    $viewingSpan = "the last $spanInDays days";
                } else {
                    $viewingSpan = "the last 24 hours";
                }

                echo    "<h1>Log of <span id='roomname-title'><code>$room</code></span><span class='viewspan'>Viewing $viewingSpan</span></h1>
                        <article id='chat'>
                        <div id='chat-entries'>";
                
                
                $messages = dbGetMessagesObject($room, $spanInDays);
                $entries = "";
                for($i=0; $i < count($messages); ++$i) {
                    $msg = $messages[$i];
                    if($msg->is_image) {
                        $entries .=    sprintf('<div class="chat-entry">'.
                                                '<span class="chat-entry-options">%s</span>'.
                                                '<span class="chat-entry-user">%s</span>'.
                                                '<span class="image-tooltip"><a href="%s"><img src="%s"/></a></span>'.
                                            '</div>',
                                            $msg->submitted_time, $msg->account_name, $msg->content, $msg->content);
                    } else {
                        $entries .=    sprintf('<div class="chat-entry">'.
                                                '<span class="chat-entry-options">%s</span>'.
                                                '<span class="chat-entry-user">%s</span>'.
                                                '<span class="chat-entry-message">%s</span>'.
                                            '</div>',
                                            $msg->submitted_time, $msg->account_name, $msg->content);
                    }
                }
                echo $entries;

                echo    '</div>'.
                        '</article>';
            }
        ?>
    </section>
    <script src="js/vendor/jquery-2.0.2.min.js" ></script>
    <script src="js/format-messages.js" ></script>
    <script src="js/base.js" ></script>
    <script>
        $('#chat-entries').scrollTop(10000000000);
    </script>
</body>
</html>