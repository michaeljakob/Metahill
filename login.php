<?php
    session_start();
    session_regenerate_id(true);
    
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] && isset($_SESSION['verified']) && $_SESSION['verified']) {
        header('Location: index.php');
        exit();
    }
    

    require_once('php/db-interface.php');
    
    $wasAccountActivationEmailSent = false;

    // check the intent
    if( isset($_GET['intent'])  && strlen(trim($_GET['intent']))>0 && 
        isset($_GET['name'])    && strlen(trim($_GET['name']))>0) {

        $intent = $_GET['intent'];
        $name = $_GET['name'];

        if($intent == 'resend_verification_email') {
            $user = dbGetUserObject($name);
            submitAccountActivationEmailPear($name, $user->email);
            $wasAccountActivationEmailSent = true;
        }
    } 


    function login() {    
        if( isset($_POST['username']) &&
            isset($_POST['password'])) {
                
            $name = htmlspecialchars($_POST['username']);
            $password = $_POST['password'];
            $verifyLoginResult = dbVerifyLogin($name, $password);
            if(gettype($verifyLoginResult) === "string") {
                // login succeeded
                $name = $verifyLoginResult;
                $_SESSION['logged_in'] = true;
                $_SESSION['name'] = htmlspecialchars($name);
                $_SESSION['password'] = $password;
                $_SESSION['verified'] = true;
                header('Location: index.php');
            } else {
                switch($verifyLoginResult) {
                    case -1:
                        echo '<div class="alert alert-error">
                                This username/password combination is invalid.<br><a href="request-new-password.php">Did you forget your password?</a>
                             </div>';
                        break;
                    case -2:
                        echo '<div class="alert alert-error">
                                Your account hasn\'t been verified, yet. To do so, <a href="login.php?intent=resend_verification_email&name='.$_POST['username'].'">request a verification email</a>.
                             </div>';
                        break;
                }
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
<link type="text/plain" rel="author" href="http://www.metahill.com/humans.txt" />

<title>Metahill | Chatrooms for enthusiasts</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    
    <section id="banner-topright">
        <a href="signup.php"><img src="img/beta-banner.png" alt="Beta. Register now and benefit!" /></a>
    </section>
    <section id="main-container" class="login">
        <article id="welcome">
            <aside id="share">
                <div><a href="https://twitter.com/share" class="twitter-share-button">Tweet</a></div>
                <div class="g-plusone" data-size="medium"></div>
                <div class="fb-like" data-href="http://www.metahill.com" data-send="false" data-layout="button_count" data-width="30" data-show-faces="true"></div>
                <div id="fb-root"></div>
                <script>(function(d, s, id) {
                  var js, fjs = d.getElementsByTagName(s)[0];
                  if (d.getElementById(id)) return;
                  js = d.createElement(s); js.id = id;
                  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=392494720871725";
                  fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));</script>
            </aside>
            <h1 class="desc">At metahill, you can meet other enthusiasts and chat with them in real-time.</h1>
            <h1 class="desc">It is entirely free, ad-free and community-driven.</h1>
            <h1 class="desc">Simple.</h1>
            <h2 class="invis">free chat rooms</h2>
            <h2 class="invis">meet enthusiasts</h2>
            <h2 class="invis">super easy</h2>
            <h2 class="invis">business meetings chat</h2>
            <h2 class="invis">share images</h2>
            <form method="post" id="action-chooser">
                <h2>Sign in</h2>
                <input type="text" name="username" autofocus="autofocus" placeholder="Email or Username" <?php if(isset($_POST['username'])) { echo 'value="' . htmlspecialchars($_POST['username']) . '"'; } ?> />
                <input type="password" name="password" placeholder="Password" <?php if(isset($_POST['username'])) { echo 'autofocus'; } ?> /><br/>
                <input type="submit" value="Sign in" class="btn btn-success" />
                <?php 
                    login();

                    if($wasAccountActivationEmailSent) {
                        echo '<div class="alert alert-success">
                                We have sent you an email. Please check your inbox (+spam folder).
                             </div>';
                    }

                ?>
            </form>
            <p>I don't have an account. <a href="signup.php">Sign up</a>.</p>
        </article>
        <footer>
            <a href="forum" target="_blank">Forum</a>&nbsp;|
            <a href="help" target="_blank">Help</a>
        </footer>

    </section>

    <script src="js/vendor/jquery-2.0.3.min.js"></script>
    <script async src="js/base.js" ></script>
    <script async src="js/login.js" async="async"></script>
    <script type="text/javascript" async="async">
        // Google+
        (function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();

        // Twitter
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
    </script>
    <script async="async">
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42248349-1', 'metahill.com');
      ga('send', 'pageview');

    </script>

</body>
</html>