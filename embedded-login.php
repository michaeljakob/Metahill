<?php
    
    if(!isset($_GET['room'])) {
        exit("No room specified. Use the `room` GET parameter.");
    }

    session_start();
    session_regenerate_id(true);
    ob_start();
    
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] && isset($_SESSION['verified']) && $_SESSION['verified']) {
        header("Location: embedded.php?{$_SERVER['QUERY_STRING']}");
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
            if(gettype(dbVerifyLogin($name, $password)) === "string") {
                // login succeeded
                $name = $verifyLoginResult;
                $_SESSION['logged_in'] = true;
                $_SESSION['name'] = htmlspecialchars($name);
                $_SESSION['verified'] = true;
                header("Location: embedded.php?{$_SERVER['QUERY_STRING']}");
            } else {
                switch($verifyLoginResult) {
                    case -1:
                        echo '<br><div class="alert alert-error">
                                This username/password combination is invalid.<br><a href="request-new-password.php">Did you forget your password?</a>
                             </div>';
                        break;
                    case -2:
                        echo '<br><div class="alert alert-error">
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
<meta name="keywords" content="instant messager, IM, instant messaging, free chat rooms, free chat, chat, chatrooms, chat-room, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">
<link rel="canonical" href="https://www.facebook.com/metahillcommunity"/>
<link rel="icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link type="text/plain" rel="author" href="http://www.metahill.com/humans.txt" />


<title>Metahill | Chatrooms for enthusiasts</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">
<link rel="stylesheet" type="text/css" href="css/embedded/login.css">

</head>
<body>
    <section id="main-container" class="login">
        <article id="welcome">
            <aside id="share">
                <script async="async">
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
                                window.location.href = 'signup-with-facebook.php?embedded=true';
                            } else {
                                console.log('User cancelled login or did not fully authorize.');
                            }
                        }, {
                            scope: 'email'
                        });
                    }
                </script>


            </aside>
            <table id="login-chooser">
                <tr>
                    <td colspan="3">
                        <h2>Sign in<hr class="style-two"></h2>
                    </td>
                </tr>
                <tr>
                    <td class="content">
                        <form method="post" id="login-native">
                            <input type="text" name="username" placeholder="Email or Username" <?php if(isset($_POST['username'])) { echo 'value="' . htmlspecialchars($_POST['username']) . '"'; } ?> />
                            <input type="password" name="password" placeholder="Password" /><br/>
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
                    </td>
                    <td>
                        <p class="or">or</p>
                    </td>
                    <td class="content">
                        <a href="#" onclick="fb_login();"><img class="facebook-login" src="img/facebook-login.png" border="0" alt="Sign up with facebook"></a>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <hr class="style-two">
                        <p class="no-account-yet">I don't have an account. <a target="_blank" href="signup.php?source=embedded.php&<?php echo $_SERVER['QUERY_STRING']; ?>">Sign up</a> or <a href="join-as-guest.php?source=embedded.php&<?php echo $_SERVER['QUERY_STRING']; ?>">join as a guest</a>.</p>
                    </td>
                </tr>           
            </table>
        </article>
    </section>


    <script async="async">
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42248349-1', 'metahill.com');
      ga('send', 'pageview');

    </script>
    <script src="js/vendor/jquery-2.0.3.min.js"></script>
    <script async src="js/base.js" ></script>
    <script async src="js/login.js" async="async"></script>

</body>
</html>