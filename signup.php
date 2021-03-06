<?php
    session_start();
    session_regenerate_id(true);
    
    require_once("php/db-interface.php");

    $isEmailAddressInUse = false;

    //submitAccountActivationEmailPear('Michael', 'michael@jakob.tv', '');
    function verifyInput($name, $password, $email) {
        $lenName = strlen($name);
        $lenPassword = strlen($password);
        $lenEmail = strlen($email);

        if($lenName < 3) {
            echo "Please choose a username with at least 3 characters.";
            return false;
        }
        if($lenName > 12) {
            echo "Please choose a username with not more than 12 characters."; 
            return false;    
        }
        if(1 === preg_match('[^a-zA-Z0-9_-]', $name)) {
            echo "Use only letters and numbers for your name, please."; 
            return false;
        }
        if(strpos($name, '@') !== false) {
            echo "Please do not use the @-sign.";
            return false;
        }
        if($lenEmail < 6) {
            echo "An email address with less than 8 characters? <i>REALLY?!</i>.";
            return false;    
        }
        if($lenEmail > 100) {
            echo "An email address with over 100 characters? <i>REALLY?!</i>."; 
            return false;    
        }
        if($lenPassword <= 7) {
            echo "Please choose a password with at least 8 characters.";
            return false;
        }
        if($lenPassword > 30) {
            echo "Please choose a password with not more than 30 characters.";
            return false;
        }
        return true;
    }

    function createUser() {
        if( isset($_POST["username"]) &&
            isset($_POST["password"]) &&
            isset($_POST["email"]) ) {
        
            $name = htmlspecialchars($_POST["username"]);
            $password = $_POST["password"];
            $email = $_POST["email"];

            if(!verifyInput($name, $password, $email)) {
                return false;
            }
            
            if(dbUserNameExists($name)) {
                echo "<div class=\"alert alert-error\">";
                echo "The username <b>$user</b> already exists!";
                echo "</div>";
                return false;
            }
            
            $ret = dbAddAccount($name, $password, $email);
            
            if($ret) {
                $_SESSION["logged_in"] = true;
                $_SESSION["name"] = htmlspecialchars($name);
                $_SESSION["verified"] = false;
                $isEmbedded = isset($_GET['source']) && $_GET['source'] == "embedded.php";

                if(submitAccountActivationEmailPear($name, $email, $_SERVER['QUERY_STRING'])) {
                    if($isEmbedded) {
                        header("Location: embedded-signup-succeeded.php");
                    } else {
                        header("Location: signup-succeeded.php");
                    }
                }
                return true;
            } else {
                echo "<div class=\"alert alert-error\">";
                echo "This email address is in use.<br><a href='request-new-password.php'>Did you forget your password?</a>";
                echo "</div>";
                echo "<div style='display:none;' id='registration-error'></div>";
                return false;
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

<title>Sign up | Chat rooms for professional and enthusiast programmers.</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once("feature/header.php"); ?>
    
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1 class="shaded">Join metahill today!</h1>
            <form method="post" id="action-chooser" autocomplete="off">
                <h2 class="desc shaded">Sign up here or <a href="login.php">Sign in</a></h2>
                
                <input type="text" autocomplete="off" placeholder="Username" pattern="[^@]*" name="username" id="reg_name" value="<?php if(isset($_POST["username"])) echo htmlspecialchars($_POST["username"]); ?>" />
                <span class="label"></span>
                <input type="text" autocomplete="off" placeholder="Email" name="email" id="reg_email" value="<?php if(isset($_POST["email"])) echo htmlspecialchars($_POST["email"]); ?>" />
                <span class="label"></span>
                <input type="password" autocomplete="off" placeholder="Password" name="password" id="reg_password" />
                <span class="label"></span>
                

                <input type="submit" value="Sign up" disabled="disabled" class="btn btn-success" />
                <?php 
                    $isEmailAddressInUse = !createUser();
                ?>
            </form>
            <footer>
                <a href="blog" target="_blank">Blog</a>&nbsp;|
                <a href="help" target="_blank">Help</a>&nbsp;|
            <a href="log/metahill" target="_blank">Logs</a>&nbsp;|
            <a href="dev" target="_blank">Developer</a>
            </footer>
      </article>
    </section>
    
    <script src="js/vendor/jquery-2.0.3.min.js" ></script>
    <script async src="js/base.js" ></script>
    <script async src="js/helper.js" ></script>
    <script async src="js/signup.js" ></script>
    <script async src="js/login.js" ></script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42248349-1', 'metahill.com');
      ga('send', 'pageview');

    </script>

    <?php
        // if email address was in use, verify username anyway
        if($isEmailAddressInUse) {
            echo "<script>";

            // verify username
            echo "$('#reg_name').keyup();";
            echo "var regEmail = $('#reg_email');";
            echo "if(regEmail.val() !== '') {";
            echo "regEmail.val('').focus();";
            echo "}";

            echo "</script>";
        }
    ?>
</body>
</html>