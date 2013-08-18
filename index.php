<?php
    session_start();
    session_regenerate_id(true);

    if( !isset($_SESSION['logged_in']) || !$_SESSION['logged_in'] || 
        !isset($_SESSION['verified']) || !$_SESSION['verified'] || 
        !isset($_SESSION['name']) || !$_SESSION['name']) {

        header('Location: login.php');
        exit();
    }

    $version = sha1(date('ddyyyymm'));
    
?><!DOCTYPE html>
<html lang="en">
<head>
    
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="description" content="Metahill is the easiest way to chat and share images in real time. The ability to exchange a lot of information including diagrams and links real-time makes it a first class business solution.">
<meta name="author" content="">
<meta name="keywords" content="instant messager, IM, instant messaging, free chat rooms, free chat, chat, chatrooms, chat-room, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">

<base href="http://127.0.0.1/metahill.com/"/>
<title>Metahill | Chatrooms for enthusiasts</title>
<link rel="stylesheet" type="text/css" href="css/bootstrap-select.min.css?v=<?php echo $version; ?>"/>
<link rel="stylesheet" type="text/css" href="css/base.css?v=<?php echo $version; ?>"/>
<link rel="stylesheet" type="text/css" href="css/index.css?v=<?php echo $version; ?>"/>
<link rel="stylesheet" type="text/css" href="css/chat.css?v=<?php echo $version; ?>"/>
<link rel="stylesheet" type="text/css" href="css/modals.css?v=<?php echo $version; ?>">

<style id="phpcss">
<?php
    require_once('php/db-interface.php');
    $user = dbGetUserObject($_SESSION['name']);
    $font = $user->chat_text_font;
    echo "body, body *{font-family:'$font';}";

    if(dbIsIpBanned($_SERVER["REMOTE_ADDR"])) {
        header('Location: banned.php');
        exit();
    }

    dbUpdateLastLoginTime($user->name);
?>
</style>
<style id="live-update-chat-text-size"></style>
<style>
    @import url(http://fonts.googleapis.com/css?family=Numans);
</style>


<?php
    $theme = 'new-world';
    if(isset($_GET['theme']) && trim($_GET['theme']) != "") {
        $theme = htmlspecialchars($_GET['theme']);
    }

    if(file_exists("theme/$theme.css")) {
        echo "<link rel='stylesheet' type='text/css' href='theme/$theme.css'/>";
    } else {
        echo "<link rel='stylesheet' type='text/css' href='$theme'/>";
    }
    
?>

</head>
<body>
    <div id="drag-and-drop-overlay"><h1>Upload</h1></div>
    <img id="magnify-image-overlay" src="img/placeholder.png" alt=""/>
    <div id="data-added-chat-entries-height"></div>
    <?php
        if($user->is_guest) {
            echo "<div id='is-guest' style='display:none;'></div>";
        }
        require_once('feature/header.php');
    ?>
    <section id="main-container">
        <div id="channels">
            <ul id="channels-list">
                <?php
                    $rooms;
                    if($user->is_guest) {
                        $rooms = array(dbGetRoomObjectFromName('metahill'));
                    } else {
                        $rooms = dbGetFavoriteRooms($_SESSION['name']);
                    }

                    foreach($rooms as $room) {
                        $topic = str_replace("'", "&#39;", $room->topic);
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
            <span id="add-new-room" class="btn btn-inverse" data-toggle="popover" data-placement="bottom">+</span>
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
                    <button class="btn" id="view-log-button" title="View Log">
                        <img src="img/icon/view_log.png" alt="View Log" />View Log
                    </button>
                    <span id="chat-header-topic"></span>
                </div>
                <div id="chat-entries-parent">
                </div>
            </article>
        </div>
    </section>
    
    <article id="submit-area">
        <span id="submit-smiley" class="btn" data-toggle="popover" data-placement="top">:)</span>
        <div id="submit-message-wrapper"><input spellcheck="false" type="text" maxlength="500" id="submit-message" autofocus autocomplete="off" /></div>
        <aside id="submit-aside-right">
            <?php
                $changeThemeName;
                $changeThemeUrl;
                if(!isset($_GET['theme'])) {
                    $changeThemeName = "Into Darkness";
                    $changeThemeUrl = "http://www.metahill.com/?theme=dark";
                } else {
                    $changeThemeName = "Back To Default";
                    $changeThemeUrl = "http://www.metahill.com/";
                }

                echo "<a class='switch-theme btn' href='$changeThemeUrl'>$changeThemeName</a>";
            ?>
            <div class="share">
                <a target="_blank" href="https://plus.google.com/102169597518297251780/posts"><img src="img/share/google-plus.png" alt=""/></a>
                <a target="_blank" href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fmetahill.com&amp;text=Elegantly%20designed%20real-time%20chat.%20Simple%20and%20(ad-)free."><img src="img/share/twitter.png" alt=""/></a>
                <a target="_blank" href="https://www.facebook.com/metahillcommunity"><img src="img/share/facebook.png" alt=""/></a>
                <a target="_blank" href="http://pinterest.com/michaelpoitroae/metahill/"><img src="img/share/pinterest.png" alt=""/></a>
            </div>
        </aside>  
        <div id="submit-status"></div>
    </article>
    <div id="submit-smiley-title" style="display:none">Image Lounge</div>
    <div id="submit-smiley-content-parent" style="display:none">
        <div id="submit-smiley-content">
            <ul>
                <?php
                    if(!$user->is_guest) {
                        $files = glob("img/extra-smilies/*");
                        foreach($files as $file) {
                            echo "<li><img src='$file' alt=''/></li>";
                        }
                    } else {
                        echo "<p>Guests are not allowed to share images.</p>";
                    }
                ?>
            </ul>
            
            <?php
                if(!$user->is_guest) {
                    $files = glob("image-upload/{$user->name}.*");
                    if(!empty($files)) {
                        echo "<hr class='fade-gray'>";
                        echo "<ul>";

                        usort($files, create_function('$b,$a', 'return filemtime($a) - filemtime($b);'));
                        $i = 0;
                        foreach($files as $file) {
                            if($i >= 10) {
                                break;
                            }
                            ++$i;
                            echo "<li><img src='$file' alt=''/></li>";
                        }

                        echo "</ul>";
                    }
                }
            ?>
        </div>
    </div>
    <!-- data section -->
    <div id="data-activeroomid" style="display:none;"><?php echo $user->activeRoom; ?></div>
    <div id="data-kick-user-content-container" style="display:none">
        <div id="data-kick-user-content">
            <p>Mute <b>%s</b> for…</p>
            <select id="data-kick-user-duration" class="selectpicker">
                <option value="20 minutes">20 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="3 hours">3 hours</option>
                <option value="1 day">1 day</option>
            </select>
            <span id="data-kick-user-content-send" class="btn">Mute</span>
        </div>
    </div>
    <div id="add-new-room-popover" style="display:none">
        <div id="add-new-room-title">Join new room<button type="button" class="close" onClick="$('#add-new-room').popover('hide');" data-dismiss="modal" aria-hidden="true">×</button></div>
        <div id="add-new-room-content">
            <form onsubmit="return false;">
                <input type="text" id="add-new-room-search" autocomplete="off" placeholder="Search room" />
                
                <div id="add-new-room-rooms-parent">
                    <ul id="add-new-room-rooms"></ul>
                </div>
                <?php 
                    if(!$user->is_guest) {
                        echo "<a id='add-new-room-create-new-room' class='btn btn-info' href='#modal-new-room' data-toggle='modal'>Create new room</a>";
                    }
                ?>
            </form>
        </div>
    </div>
    <!-- data section end -->
    <?php 
        require_once('feature/modals.php');
        require_once('js/index.php.jsinclude.php');
        
        if((!$user->is_guest) && isset($_GET['join']) && strlen(trim($_GET['join'])) > 0) {
            $roomName = $_GET['join'];
            // is it already a favorite?
            foreach($rooms as $room) {
                if(strtolower($room->name) === strtolower($roomName)) {
                    return;
                }
            }
            if(dbRoomExists($roomName)) {
                $room = dbGetRoomObjectFromName($roomName);
                $roomName = $room->name; // we want the original room name
                $roomId = $room->id;
                $roomTopic = str_replace('"', "&#34;", $room->topic);
                $roomOwner = $room->owner;

                $out = "<script>$(document).ready(function(){setTimeout(function() {";
                $out .= "var newRoom = '<li data-roomid=\"$roomId\" data-topic=\"$roomTopic\" data-owner=\"$roomOwner\">$roomName</li>';";
                $out .= "metahill.main.onNewRoomClicked($(newRoom));";
                $out .= "}, 800)});</script>";

                echo $out;
            }
        }

    ?>

    <script>
        $(document).ready(
            setTimeout(function() {
            <?php
                // we're on the safe side when using a little timeout, although it should not be an issue
                $mutedRooms = dbGetMutedRooms($user->id);
                if($mutedRooms != null) {
                    for($i=0; $i<count($mutedRooms); ++$i) {
                        $entry = $mutedRooms[$i];
                        $roomId = $entry->room_id;
                        $timeLeft = strtotime($entry->unmute_time) - time();
                        echo "metahill.main.mutedRoomIds.push('$roomId');";
                        echo "metahill.main.unmuteRoomId('$roomId', $timeLeft*1000);";
                        echo "if(metahill.main.activeRoom.attr('data-roomid')==='$roomId'){ $('#submit-message').prop('disabled', true).blur();}";
                    }
                }
            ?>
        }, 100));
    </script>
    <script async="async" src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?lang=css<?php echo ($theme === 'dark') ? ("&skin=sons-of-obsidian") : (""); ?>"></script>
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