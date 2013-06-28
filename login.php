<?php
    session_start();
    session_regenerate_id(true);
    
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true && $_SESSION['verified']) {
        header('Location: index.php?' . session_name() . '=' . session_id());
        exit();
    }
    

    require_once('php/db-interface.php');
    

    // check the intent
    if( isset($_GET['intent'])  && strlen(trim($_GET['intent']))>0 && 
        isset($_GET['name'])    && strlen(trim($_GET['name']))>0) {

        $intent = $_GET['intent'];
        $name = $_GET['name'];

        if($intent == 'resend_verification_email') {
            dbSendVerificationEmail($name);
        }
    } 


    function login() {    
        if( isset($_POST['username']) &&
            isset($_POST['password'])) {
                
            $name = htmlspecialchars($_POST['username']);
            $password = $_POST['password'];
            $verifyLoginResult = dbVerifyLogin($name, $password);
            switch($verifyLoginResult) {
                case 1:
                    $_SESSION['logged_in'] = true;
                    $_SESSION['name'] = htmlspecialchars($name);
                    $_SESSION['password'] = $password;
                    $_SESSION['verified'] = true;
                    header('Location: index.php?' . session_name() . '=' . session_id());
                    break;
                case -1:
                    echo '<div class="alert alert-error">
                            This username/password combination is invalid.
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
    require_once('feature/head.php'); 
?>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="login">
        <article id="welcome">
            <p class="desc">Meet other enthusiasts and chat with them in real-time.</p>
            <p class="desc">It is entirely free and community-driven.</p>
            <p class="desc">And every decision is made by <u>you</u>.</p>
            <form method="post" id="action-chooser">
                <h2>Sign in</h2>
                <input type="text" name="username" autofocus="true" placeholder="Email or Username" <?php if(isset($_POST['username'])) { echo 'value="' . htmlspecialchars($_POST['username']) . '"'; } ?> />
                <input type="password" name="password" placeholder="Password" <?php if(isset($_POST['username'])) { echo 'autofocus'; } ?> /><br/>
                <input type="submit" value="Sign in" class="btn btn-success" />
                <?php login(); ?>
            </form>
            <p>I don't have an account. <a href="signup.php">Sign up</a>.</p>
        </article>
        <footer>
            <a href="blog" target="_blank">Blog</a>&nbsp;|
            <a href="help" target="_blank">Help</a>
        </footer>

    </section>
    
    <script src="js/vendor/jquery-1.9.1.min.js" ></script>
    <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" ></script>
    <script src="js/vendor/jquery-ui-1.10.2.custom.min.js" ></script>
    <script src="js/base.js" ></script>
    <script src="js/login.js" ></script>
</body>
</html>