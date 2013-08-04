<?php
    
    // log out
    session_start();
    if(isset($_SESSION['logged_in'])) {
        $_SESSION['logged_in'] = false;
        session_destroy();
    }

    if(isset($_POST["feedback-box"]) && strlen($_POST["feedback-box"]) >= 10) {
        submitFeedback($_POST["feedback-box"]);
    }

    
    function submitFeedback($body) {
        require_once "Mail.php";

        $from     = "Metahill <notification@metahill.com>";
        $subject  = "[feedback] Metahill account deletion";
        $to       = "michael@jakob.tv";

        $host     = "ssl://smtp.gmail.com";
        $port     = "465";
        $username = "notification@jakob.tv";  //<> give errors
        $password = 'S*#uj?]5!#1$)!q6?o^1X+03}';

        $headers = array(
            'From'    => $from,
            'To'      => $to,
            'Subject' => $subject,
            'MIME-Version' => "1.0",
            'Content-type' => "text/html; charset=iso-8859-1",
        );
        $smtp = Mail::factory('smtp', array(
            'host'     => $host,
            'port'     => $port,
            'auth'     => true,
            'username' => $username,
            'password' => $password
        ));

        $mail = $smtp->send($to, $headers, $body);

        if (PEAR::isError($mail)) {
            echo("<p>" . $mail->getMessage() . "</p>");
            return false;
        } else {
            header("Location: login.php");
            return true;
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Why did you delete you account?</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="login">
        <article id="welcome">
            <p class="desc">Your account has successfully been deleted.</p>
            <p class="desc">Please wait just one more second and tell us:</p>
            <form method="post">
                <h2><strong>Why did you delete your account?</strong></h2>
                <textarea id="feedback-box" name="feedback-box" maxlength="500" ></textarea>
                <input type="submit" disabled id="submit-feedback" value="Submit feedback" class="btn btn-success" />
            </form>
        </article>
        <footer>
            <a href="login.php">Sign in</a>&nbsp;|
            <a href="signup.php">Sign up</a>&nbsp;|
            <a href="blog">Blog</a>&nbsp;|
            <a href="help">Help</a>
        </footer>

    </section>
    
    <script src="js/vendor/jquery-2.0.3.min.js"></script>
    <script async src="js/base.js" ></script>
    <script>
        $('#feedback-box').bind('propertychange keyup input paste', function() {
            var len = $(this).val().length;
            if(len >= 10 && len <= 500) {
                $('#submit-feedback').removeAttr('disabled');
            } else {
                $('#submit-feedback').prop('disabled', true);
            }
        });
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