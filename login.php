<?php
    session_start();
    session_regenerate_id(true);
    
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true && $_SESSION['verified']) {
        header('Location: index.php?' . session_name() . '=' . session_id());
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
                header('Location: index.php?' . session_name() . '=' . session_id());
            } else {
                switch($verifyLoginResult) {
                    case -1:
                        echo '<div class="alert alert-error">
                                This username/password combination is invalid. Request a new password <a href="request-new-password.php">here</a>.
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
<title>Metahill | Where experts talk | Login</title>
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
            <p class="desc">At metahill, you can meet other enthusiasts and chat with them in real-time.</p>
            <p class="desc">It is entirely free, ad-free and community-driven.</p>
            <p class="desc">Simple.</p>
            <form method="post" id="action-chooser">
                <h2>Sign in</h2>
                <input type="text" name="username" autofocus="true" placeholder="Email or Username" <?php if(isset($_POST['username'])) { echo 'value="' . htmlspecialchars($_POST['username']) . '"'; } ?> />
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

    <script src="js/vendor/jquery-2.0.2.min.js"></script>
    <script async src="js/base.js" ></script>
    <script async src="js/login.js" ></script>
    <script type="text/javascript">
        // Google+
        (function() {
            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/plusone.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();

        // Twitter
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
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