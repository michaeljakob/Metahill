<?php
    require_once('php/db-interface.php');

    $room = NULL;
    $roomExists = false;
    
    if(isset($_GET['room']) && strlen(trim($_GET['room'])) > 0) {
        $room = $_GET['room'];
        $roomExists = dbRoomExists($room);
    }


    /**
     * Parses the GET parameters and returns the requested time span in days
     * @return int Timespan in days. The default is 3 days.
     */
    function getRequestedTimeSpan() {
        if(isset($_GET['timespan']) && is_numeric($_GET['timespan'])) {
            $days = intval($_GET['timespan']);
            if($days > 0) {
                return $days;
            }
        }
        // default timespan is 3 days
        return 3;
    }
    
?><!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<base href="../" >
<title>Metahill | Log <?php if($room != NULL && $roomExists) { echo "of $room"; } ?></title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/chat.css">
<link rel="stylesheet" type="text/css" href="css/log.css">


</head>


<body>
    <?php require_once('feature/header.php'); ?>
    <section id="main-container" class="log-main-container">
    
        <?php
            function makeLinksClickable($text){
                return preg_replace('!(((f|ht)tp(s)?://)[-a-zA-Zа-яА-Я()0-9@:%_+.~#?&;//=]+)!i', '<a href="$1">$1</a>', $text);
            }

            if($room == NULL || !$roomExists) {
                echo    "<div class='alert alert-error'>
                            <h4>#?$1%(*&^%$#@</h4>
                            The requested room <i>$room</i> does not exist!
                        </div>";
            } else {
                $spanInDays = getRequestedTimeSpan();
                $viewingSpan;
                if($spanInDays >= 2) {
                    $viewingSpan = "the past $spanInDays days";
                } else {
                    $viewingSpan = "the past 24 hours";
                }
                $messages = dbGetMessagesObject($room, $spanInDays);
                $messageCount = count($messages);
                $bracketText = "";
                if($messageCount === 1) {
                    $bracketText = "1 message";
                } else {
                    $bracketText = $messageCount . " messages";
                }

                echo    "<h1>Log of <span id='roomname-title'>\"$room\"</span><span class='viewspan'>Viewing $viewingSpan ($bracketText)</span></h1>
                        <article id='chat'>
                        <div id='chat-entries'>";
                
                
                $entries = "";

                $imageEntryTemplate =   '<div class="chat-entry">'.
                                            '<span class="chat-entry-options">%s</span>'.
                                            '<span class="chat-entry-user">%s</span>'.
                                            '<span class="chat-entry-message"><a href="%s"><img class="image-message" src="%s"/></a></span>'.
                                        '</div>';

                $textEntryTemplate =    '<div class="chat-entry">'.
                                            '<span class="chat-entry-options">%s</span>'.
                                            '<span class="chat-entry-user">%s</span>'.
                                            '<span class="chat-entry-message">%s</span>'.
                                        '</div>';

                for($i=0; $i < $messageCount; ++$i) {
                    $msg = $messages[$i];
                    $accountName = $msg->account_name;
                    $content = $msg->content;
                    if($accountName !== "") {
                        $accountName .= ":";
                    } else {
                        $content = "<em>$content</em>";
                    }
                    if($msg->is_image) {
                        $entries .= sprintf($imageEntryTemplate, $msg->submitted_time, $accountName, $content, $content);
                    } else {
                        $entries .= sprintf($textEntryTemplate, $msg->submitted_time, $accountName, makeLinksClickable($content));
                    }
                }
                echo $entries;

                echo    '</div>'.
                        '</article>';
            }
        ?>
    </section>
    <section id="other-rooms">
        <?php
            $featured = dbGetFeaturedRooms(10);
            for($i=0; $i<count($featured); ++$i) {
                $roomName = $featured[$i]->name;
                echo "<a href='http://www.metahill.com/log/$roomName'>$roomName</a>";
            }


        ?>
    </section>
    <script src="js/vendor/jquery-2.0.3.min.js" ></script>
    <script src="js/base.js" ></script>
    <script>
        // scroll to bottom
        $(function() {
            var chatEntries = $("#chat-entries");
            $(window).resize(function() {
                chatEntries.height($(window).height() - 238);
                chatEntries.prop({ scrollTop: chatEntries.prop('scrollHeight')});
            });
            $(window).resize();
            setTimeout(function() { $(window).resize(); }, 100);
            setTimeout(function() { $(window).resize(); }, 200);
            setTimeout(function() { $(window).resize(); }, 300);
        });

        // pop up the links to the other rooms
        $(function() {
            function quadraticEaseInOut(t, b, c, d) {
                t /= d/2;
                if (t < 1)
                    return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            };

            $('#other-rooms').children().each(function(index, link) {
                setTimeout(function() {
                    $(link).animate({'margin-top': 0});
                }, (index+1) * 50);
            });
        });
    </script>
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