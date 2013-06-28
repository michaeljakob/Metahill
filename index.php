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
<?php
    require_once('feature/head.php'); 
?>
<link rel="stylesheet" type="text/css" href="css/base.css"/>
<link rel="stylesheet" type="text/css" href="css/chat.css"/>
<!-- <link rel="stylesheet" type="text/css" href="themes/dark/css/chat.css"/> -->
<link rel="stylesheet" type="text/css" href="css/bootstrap-select.min.css">


</head>
<body>
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
        <article id="chat">
            <div id="chat-header">
                <span class='label'>Topic</span>
                <span id="chat-header-topic"></span>

                <button class="btn" id="room-settings">
                    <img src="img/icon/room_settings.png" />
                    Room settings
                </button>
                <button class="btn" id="view-log-button">
                    <img src="img/icon/view_log.png" />
                    View history
                </button>
            </div>
            <div id="chat-entries">
            </div>
        </article>
        <aside id="channel-attendees">
            <form>
                <input type="text" id="filter-search-user" placeholder="Search user">
                <ul id="channel-attendees-entries">
                </ul>
            </form>
        </aside>
    </section>
    
    <article id="submit-area">
        <input type="text" id="submit-message" autofocus autocomplete="off"></input>
        <div id="submit-status">
        </div>
    </article>
    <div id="drag-and-drop-overlay"></div>
    <!-- data section -->
    <div id="add-new-room-popover" style="display:none">
        <div id="add-new-room-title">Join new room<button type="button" class="close" onClick="$('#add-new-room').popover('hide');" data-dismiss="modal" aria-hidden="true">×</button></div>
        <div id="add-new-room-content">
            <form>
                <input type="text" id="add-new-room-search" placeholder="Search room" />
                <ul id="add-new-room-rooms">
                </ul>
                <a class="btn btn-info" href="#modal-new-room" data-toggle="modal" onclick="">Create new room</a>
            </form>
        </div>
    </div>

    <?php require_once('feature/modals.php'); ?>
    <script src="js/vendor/jquery-1.9.1.min.js" ></script>
    <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" ></script>
    <script src="js/vendor/bootstrap.min.js" ></script>
    <script src="js/vendor/bootstrap-select.min.js" ></script>
    <script src="js/vendor/bootstrap-dropdown.js" ></script>
    <script src="js/vendor/jquery-ui-1.10.2.custom.min.js" ></script>
    <script src="js/vendor/jquery.filterList.1.0.js" ></script>
    <script src="js/vendor/jquery.titlealert.min.js" ></script>
    <script src="js/helper.js" ></script>
    <script src="js/room-proposer.js" ></script>
    <script src="js/sound.js" ></script>
    <script src="js/status.js" ></script>
    <script src="js/format-messages.js" ></script>
    <script src="js/image-upload.js"></script>
    <script src="js/tip-poster.js"></script>
    <script src="js/main.js" ></script>
    <script src="js/modals.js" ></script>
    <script src="js/init.js" ></script>
    <script src="js/base.js" ></script>
    <script src="js/google-web-fonts.js" ></script>
    <script src="js/chat.js"></script>
    <script src="js/jquery.transit.min.js"></script>
</body>

</html>