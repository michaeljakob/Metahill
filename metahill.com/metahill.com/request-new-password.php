<?php
    if(isset($_POST["email"])) {
        submitNewPasswordRequest($_POST["email"]);
    }

    
    function submitNewPasswordRequest($to) {
        require_once "Mail.php";
        require_once "php/db-interface.php";

        $verificationId = dbCreateEntryPasswordChangeRequests($to);
        $verificationLink = "http://www.metahill.com/confirm-new-password.php?verification_id=".$verificationId;
        $body = file_get_contents("feature/confirm_new_password.html");
        $body = str_replace("::verification_link::", $verificationLink, $body);

        $from     = "Metahill <notification@metahill.com>";
        $subject  = "Have you requested a new password for metahill?";
        //$to       = "";

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
            header("Location: request-new-password-succeeded.php");
            return true;
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Request a new password</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

<style>
#request-new-password {
    margin-top: 5px;
    width: 220px;
}
</style>
</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="login">
        <article id="welcome">
            <p class="desc">Lost your passord?</p>
            <p class="desc">No problem, request a new one here.</p>
            <form method="post">
                <h2></h2><br>
                <input type="text" id="email" name="email" placeholder="Your email address" />
                <input type="submit" disabled id="request-new-password" value="Request password" class="btn btn-success" />
            </form>
        </article>
        <footer>
            <a href="login.php">Sign in</a>&nbsp;|
            <a href="signup.php">Sign up</a>&nbsp;|
            <a href="forum">Forum</a>&nbsp;|
            <a href="help">Help</a>
        </footer>

    </section>
    
    <script src="js/vendor/jquery-2.0.3.min.js"></script>
    <script async src="js/base.js" ></script>
    <script>
        $('#email').bind('propertychange keyup input paste', function() {
            var mail = $(this).val();
            var len = mail.length;
            var regEx = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Za-z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;

            if(regEx.test(mail)) {
                $('#request-new-password').removeAttr('disabled');
            } else {
                $('#request-new-password').prop('disabled', true);
            }
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