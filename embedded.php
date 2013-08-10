<?php
    if(!isset($_GET['room'])) {
        exit("No room specified. Use the `room` GET parameter.");
    }

    session_start();
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] && isset($_SESSION['verified']) && $_SESSION['verified']) {
        session_regenerate_id(true);
    } else {
        header("Location: embedded-login.php?{$_SERVER['QUERY_STRING']}");
        exit();
    }
    
    $api_isMini = isset($_GET['size']) && $_GET['size'] === 'mini';
    $api_hideAttendeesBar = $api_isMini || isset($_GET['hide-attendees-bar']) && $_GET['hide-attendees-bar'] === 'true';

    require_once('php/db-interface.php');
    $room = dbGetRoomObjectFromName(htmlspecialchars(basename($_GET['room'])));
    if($room === null) {
        exit("No room `{$_GET['room']}` found.");
    }


?><!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<base href="http://127.0.0.1/metahill.com/"/>
<title>Metahill | Chatrooms for enthusiasts</title>
<link rel="stylesheet" type="text/css" href="css/base.css"/>
<link rel="stylesheet" type="text/css" href="css/index.css"/>
<link rel="stylesheet" type="text/css" href="css/chat.css"/>
<link rel="stylesheet" type="text/css" href="css/bootstrap-select.min.css"/>
<link rel="stylesheet" type="text/css" href="css/embedded/index.css"/>
<?php
    if($api_isMini) {
        echo '<link rel="stylesheet" type="text/css" href="css/embedded/size-mini.css"/>';
    }
?>

<style id="phpcss">
<?php
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
<?php
    $theme = 'default';
    if(isset($_GET['theme']) && trim($_GET['theme']) != '') {
        $theme = htmlspecialchars($_GET['theme']);
        if(file_exists("theme/$theme.css")) {
            echo "<link rel='stylesheet' type='text/css' href='theme/$theme.css'/>";
        } else {
            echo "<link rel='stylesheet' type='text/css' href='$theme'/>";
        }
    }
?>
</head>
<body>
    <div id="drag-and-drop-overlay"><h1>Upload</h1></div>
    <div id="data-added-chat-entries-height"></div>
    <?php
        if($user->is_guest) {
            echo "<div id='is-guest' style='display:none;'></div>";
        }
        $userId = $user->id;
        $userName = $user->name;
        echo "<div id='user-id' style='display:none;'>$userId</div>";
        echo '<div id="userbar" style="display:none">
                <div class="btn-group" id="user-name">
                    <button class="btn dropdown-toggle" data-toggle="dropdown">'. $userName .'&nbsp;<span class="caret"></span></button>
                </div>
              </div>';

    ?>
    
    <section id="main-container">
        <div id="channels" style="display:none">
            <ul id="channels-list">
                <?php
                    $roomName = $room->name;
                    $roomId = $room->id;
                    $roomOwner = $room->owner;
                    echo  "<li class='btn room-favorite' data-owner='$roomOwner' data-roomid='$roomId'>".
                            "$roomName<button class='close room-close'>&times;</button>".
                            "<span class='unseen-messages'></span>".
                          "</li>";
                ?>
            </ul>
            <span id="add-new-room" class="btn btn-inverse" data-toggle="popover" data-placement="bottom">+</span>
        </div>
        <div id="chat-and-attendees">
            <aside id="channel-attendees" <?php if($api_hideAttendeesBar) {echo "style='display:none';"; }?>>
                <form>
                    <input type="text" id="filter-search-user" autocomplete="off" placeholder="Search user">
                    <ul id="channel-attendees-entries"></ul>
                </form>
            </aside>
            <article id="chat">
                <div id="chat-header" style="display:none;">
                    <span class='label'>Topic</span>
                    <button class="btn" id="view-log-button" alt="View Log" title="View Log" >
                        <img src="img/icon/view_log.png" />View Log
                    </button>
                    <span id="chat-header-topic"></span>
                </div>
                <div id="chat-entries-parent"></div>
            </article>
        </div>
    </section>
    
    <article id="submit-area">
        <?php
            $roomNameUrlEncoded = rawurlencode($roomName);

            $submitMetahillText = "Metahill";
            $submitHelpText = "Help";

            if($api_isMini) {
                $submitMetahillText = "<img src='http://www.metahill.com/favicon.ico' style='width:20px;'/>";
                $submitHelpText = "?";
            }

            echo "<a target='_blank' id='submit-metahill' href='http://www.metahill.com/join/$roomNameUrlEncoded' class='btn'>$submitMetahillText</a>";
            echo "<a target='_blank' id='submit-help' href='http://www.metahill.com/help' class='btn'>$submitHelpText</a>";
        ?>
        <div id="submit-message-wrapper"><input type="text" maxlength="500" id="submit-message" autocomplete="off" /></div>
        <?php
            if(!$api_isMini) {
                $changeThemeName;
                $changeThemeUrl;
                if(!isset($_GET['theme'])) {
                    $changeThemeName = "Into Darkness";
                    $changeThemeUrl = "embedded.php?{$_SERVER['QUERY_STRING']}&theme=dark";
                } else {
                    $changeThemeName = "Back To Normality";
                    $changeThemeUrl = str_replace("&theme=dark", "", "embedded.php?{$_SERVER['QUERY_STRING']}");
                }

                echo "<a id='submit-switch-theme' class='btn' href='$changeThemeUrl'>$changeThemeName</a>";
            }
        ?>
        <div id="submit-status"></div>
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
    <?php 
        require_once('js/index.php.jsinclude.php');
    ?>
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