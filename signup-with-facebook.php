<?php

require_once('php/facebook/facebook.php');
require_once('php/db-interface.php');

$config = array();
$config['appId'] = '392494720871725';
$config['secret'] = '9106ba99ee2e0439e4f1e861b5c6400c';

$facebook = new Facebook($config);
$facebookUser = $facebook->getUser();
$facebookUserProfile = null;
if ($facebookUser) {
    try {
        // Proceed knowing you have a logged in user who's authenticated.
        $facebookUserProfile = $facebook->api('/me');
    } catch (FacebookApiException $e) {
        error_log($e);
        $facebookUser = null;
    }
}

$nickNameSuggestion = "";
$errorMessage = null;
if($facebookUserProfile !== null) {
    $metahillUser = dbGetUserObjectByFacebookId($facebookUserProfile["id"]);
    if($metahillUser !== null) {
        $_SESSION["name"] = $metahillUser->name;
        $_SESSION["logged_in"] = true;
        $_SESSION["verified"] = true;
        header("Location: index.php");
        exit();
    } else {
        if(isset($_POST["username"])) {
            $name = $_POST["username"];
            $password = $_POST["password"];
            $nameLen = strlen($name);
            if($nameLen >= 3 && $nameLen <= 12 && strpos($name, "@") === false) {
                if(dbAddFacebookAccount($name, $password, $facebookUserProfile["email"], $facebookUserProfile["id"])) {
                    $_SESSION["name"] = $name;
                    $_SESSION["logged_in"] = true;
                    $_SESSION["verified"] = true;
                    if(isset($_GET['embedded']) && $_GET['embedded'] === 'true') {
                        header("Location: embedded.php");
                    } else {
                        header("Location: index.php");
                    }
                    exit();
                } else {
                    $errorMessage = "This email address is already in use. Please <a href='signup.php'>create an account manually</a>.";
                }
            }
        } else {
            $nickNameSuggestion = $facebookUserProfile["first_name"] . $facebookUserProfile["last_name"][0];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="Metahill is the easiest way to chat, text, message and share images in real time with other enthusiasts all across the web. The ability to exchange a lot of information including diagrams and links real-time makes it a first class business solution.">
<meta name="author" content="">
<meta name="keywords" content="free chat rooms, free chat, chat, chatrooms, chat-room, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">
<link rel="canonical" href="https://www.facebook.com/metahillcommunity"/>
<link rel="icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />

<title>Sign up | Chatrooms for enthusiasts</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once("feature/header.php"); ?>
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1>Just two more things...</h1>
            <form method="post" id="action-chooser">
                <h2 class="desc">Pick a nickname</h2>
                
                <input type="text" placeholder="Username" autofocus="true" pattern="[^@]*" name="username" id="reg_name" value="<?php echo $nickNameSuggestion; ?>" />
                <span class="label"></span>
                <input id="reg_password" type="password" name="password" placeholder="Password" />
                <span class="label"></span>
                

                <input type="submit" value="Sign up" class="btn btn-success" />
                <?php
                    if($errorMessage !== null) {
                        echo "<br/>";
                        echo "<div class='alert alert-error'>$errorMessage</div>";
                    }
                ?>
            </form>
      </article>
    </section>

    <script src="js/vendor/jquery-2.0.3.min.js"></script>
    <script src="js/base.js"></script>
    <script src="js/helper.js"></script>
    <script src="js/signup.js"></script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42248349-1', 'metahill.com');
      ga('send', 'pageview');
    </script>
    <script>
        $(function(){ $('#reg_name').keyup(); });
    </script>
</body>
</html>