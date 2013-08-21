<?php
    session_start();
    session_regenerate_id(true);
    ob_start();
    
    if( isset($_SESSION['logged_in']) && $_SESSION['logged_in'] && 
        isset($_SESSION['verified']) && $_SESSION['verified'] &&
        isset($_SESSION['name'])) {
        header("Location: index.php");
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
                $_SESSION['verified'] = true;
                header("Location: index.php?{$_SERVER['QUERY_STRING']}");
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

<meta name="description" content="Metahill is the easiest way to chat and share images in real time. The ability to exchange a lot of information including diagrams and links real-time makes it a first class business solution.">
<meta name="author" content="">
<meta name="keywords" content="instant messager, IM, instant messaging, free chat rooms, free chat, chat, chatrooms, chat-room, professional, chat with your fans, chat with your heros, enthusiast, job, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">
<link rel="icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link type="text/plain" rel="author" href="http://www.metahill.com/humans.txt" />


<title>Metahill | Chatrooms for enthusiasts</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="login">
        <article id="welcome">
            <aside id="share">

                <a target="_blank" href="https://plus.google.com/102169597518297251780/posts"><img alt="Metahill at Google+" src="img/share/google-plus.png"/></a>
                <a target="_blank" href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fmetahill.com&amp;text=Elegantly%20designed%20real-time%20chat.%20Simple%20and%20(ad-)free."><img alt="Metahill at Twitter" src="img/share/twitter.png"/></a>
                <a target="_blank" href="https://www.facebook.com/metahillcommunity"><img alt="Metahill at Facebook" src="img/share/facebook.png"/></a>
                <a target="_blank" href="http://pinterest.com/michaelpoitroae/metahill/"><img alt="Metahill at pInterest" src="img/share/pinterest.png"/></a>
                
                <div id="fb-root"></div>
                <script>
                  window.fbAsyncInit = function() {
                    FB.init({
                            appId      : '392494720871725',
                            channelUrl : '//www.metahill.com/channel.html',
                            status     : true, // check login status
                            cookie     : true, // enable cookies to allow the server to access the session
                            xfbml      : true  // parse XFBML
                        });
                    };
                    (function(d){
                        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                        if (d.getElementById(id)) {return;}
                        js = d.createElement('script'); js.id = id; js.async = true;
                        js.src = "//connect.facebook.net/en_US/all.js";
                        ref.parentNode.insertBefore(js, ref);
                    }(document));

                    function fb_login() {
                        FB.login(function(response) {
                            if (response.authResponse) {
                                window.location.href = 'signup-with-facebook.php';
                            } else {
                                console.log('User cancelled login or did not fully authorize.');
                            }
                        }, {
                            scope: 'email'
                        });
                    }
                </script>


            </aside>
            <h1 class="desc">At metahill, you can meet other enthusiasts and chat with them in real-time.</h1>
            <h1 class="desc">It is entirely free, ad-free and community-driven.</h1>
            <h1 class="desc">Simple.</h1>
            <table id="login-chooser">
                <tr>
                    <td colspan="5">
                        <h2>Sign in</h2>
                        <hr class="fade-white top-hr">
                    </td>
                </tr>
                <tr>
                    <td class="content">
                        <a id="login-native-button">
                            <span class="login-circle">m</span>
                        </a>
                        <span class="login-title">I'm registered</span>
                    </td>
                    <td>
                        <p class="or">or</p>
                    </td>
                    <td class="content">
                        <a href="#" onclick="fb_login();">
                            <span class="login-circle">f</span>
                        </a>
                        <span class="login-title">I have Facebook</span>
                    </td>
                    <td>
                        <p class="or">or</p>
                    </td>
                    <td class="content">
                        <a href="join-as-guest.php?<?php echo "{$_SERVER['QUERY_STRING']}&skip-verify=true";?>">
                            <span class="login-circle">g</span>
                        </a>
                        <span class="login-title">I am a guest</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <hr class="fade-white">
                        <p class="no-account-yet">I don't have an account. <a href="signup.php">Sign up</a>.</p>
                    </td>
                </tr>           
            </table>
        </article>
        <footer>
            <a href="blog" target="_blank">Blog</a>&nbsp;|
            <a href="help" target="_blank">Help</a>&nbsp;|
            <a href="log/metahill" target="_blank">Logs</a>
        </footer>

    </section>

    <!-- data section -->
    <div id="login-native-title" style="display:none;">
          Sign in
    </div>
    <div id="login-native-content" style="display:none;">
         <form method="post" id="login-native">
            <input type="text" name="username" autofocus="autofocus" placeholder="Email or Username" <?php if(isset($_POST['username'])) { echo 'value="' . htmlspecialchars($_POST['username']) . '"'; } ?> />
            <input type="password" name="password" placeholder="Password" <?php if(isset($_POST['username'])) { echo 'autofocus'; } ?> />
            <input type="submit" value="Sign in" class="btn btn-success" />
            <?php 
                login();
                if($wasAccountActivationEmailSent) {
                    echo '<div class="alert alert-success">'.
                            'We have sent you an email. Please check your inbox (+spam folder).'.
                          '</div>';
                }
            ?>

        </form>
    </div>

    <!-- data section -->
    <div id="login-guest-title" style="display:none;">
          Sign in
    </div>
    <div id="login-guest-content" style="display:none;">
         <form method="post" id="login-guest">
            <input type="text" name="username" autofocus="autofocus" placeholder="Email or Username" <?php if(isset($_POST['username'])) { echo 'value="' . htmlspecialchars($_POST['username']) . '"'; } ?> />
            <input type="password" name="password" placeholder="Password" <?php if(isset($_POST['username'])) { echo 'autofocus'; } ?> />
            <input type="submit" value="Sign in" class="btn btn-success" />
            <?php 
                login();
                if($wasAccountActivationEmailSent) {
                    echo '<div class="alert alert-success">'.
                            'We have sent you an email. Please check your inbox (+spam folder).'.
                          '</div>';
                }
            ?>

        </form>
    </div>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42248349-1', 'metahill.com');
      ga('send', 'pageview');

    </script>
    <script src="js/vendor/jquery-2.0.3.min.js"></script>
    <script src="js/vendor/bootstrap.min.js"></script>
    <script async src="js/base.js" ></script>
    <script async src="js/login.js"></script>

</body>
</html>