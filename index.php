<?php
    session_start();
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] && $_SESSION['verified']) {
        session_regenerate_id(true);
    } else {
        header('Location: login.php');
        exit();
    }
?><!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Where enthusiasts talk</title>
<link rel="stylesheet" type="text/css" href="css/base.css"/>
<link rel="stylesheet" type="text/css" href="css/index.css"/>
<link rel="stylesheet" type="text/css" href="css/chat.css"/>
<link rel="stylesheet" type="text/css" href="css/bootstrap-select.min.css">

<?php
    if(isset($_GET['theme']) && trim($_GET['theme']) != '') {
        $theme = basename($_GET['theme']);
        if(file_exists("themes/".$theme."/css/chat.css")) {
            echo "<link rel='stylesheet' type='text/css' href='themes/$theme/css/chat.css'/>";
        }
    }
?>

</head>
<body>
    <div id="drag-and-drop-overlay"><h1>Upload</h1></div>
    <?php require_once('feature/header.php'); ?>
    <section id="main-container">
        <div id="channels">
            <ul id="channels-list">
                <?php
                    require_once('php/db-interface.php');

                    $rooms = dbGetFavoriteRooms($_SESSION['name']);
                    foreach($rooms as $room) {
                        $topic = $room->topic;
                        $roomName = $room->name;
                        $roomId = $room->id;
                        $roomOwner = $room->owner;
                        echo  "<li class='btn room-favorite' data-owner='$roomOwner' data-roomid='$roomId' data-topic='$topic'>".
                                "$roomName<button class='close room-close'>&times;</button>".
                                "<span class='unseen-messages'></span>".
                              "</li>";
                    }
                ?>
            </ul>
            <li id="add-new-room" class="btn btn-inverse" data-toggle="popover" data-placement="bottom">+</li>
        </div>
        <div id="chat-and-attendees">
            <aside id="channel-attendees">
                <form>
                    <input type="text" id="filter-search-user" autocomplete="off" placeholder="Search user">
                    <ul id="channel-attendees-entries"></ul>
                </form>
            </aside>
            <article id="chat">
                <div id="chat-header">
                    <span class='label'>Topic</span>
                    <span id="chat-header-topic"></span>
                    <button class="btn" id="view-log-button">
                        <img src="img/icon/view_log.png" />View history
                    </button>
                </div>
                <div id="chat-entries"></div>
            </article>
        </div>
    </section>
    
    <article id="submit-area">
        <input type="text" id="submit-message" autofocus autocomplete="off"></input>
        <div id="submit-status">
        </div>
    </article>
    <!-- data section -->
    <div id="add-new-room-popover" style="display:none">
        <div id="add-new-room-title">Join new room<button type="button" class="close" onClick="$('#add-new-room').popover('hide');" data-dismiss="modal" aria-hidden="true">×</button></div>
        <div id="add-new-room-content">
            <form onsubmit="return false;">
                <input type="text" id="add-new-room-search" autocomplete="off" placeholder="Search room" />
                
                <div id="add-new-room-rooms-parent">
                    <ul id="add-new-room-rooms"></ul>
                </div>
                <a id="add-new-room-create-new-room" class="btn btn-info" href="#modal-new-room" data-toggle="modal">Create new room</a>
            </form>
        </div>
    </div>

    <?php require_once('feature/modals.php'); ?>

    <script src="js/vendor/vendor.js" ></script>
    <script src="js/combined.js" ></script>
    

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42248349-1', 'metahill.com');
      ga('send', 'pageview');

    </script>
</body>

</html>