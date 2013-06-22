<?php
    session_start();
    session_regenerate_id(true);
    
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
    
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1>Your account has been created!</h1>
            <form method="post" id="action-chooser">
                <p class="desc">We have sent you an email.</p>
                <p class="desc">Please check your inbox (+spam folder).</p>
            </form>
            <p>To activate your account, you need to click<br> the link within the mail
                we sent you.</p>
            <p>Afterwards, you can <a href="login.php">sign in</a>.</p>
            <footer>
                <a href="blog" target="_blank">Blog</a>&nbsp;|
                <a href="help" target="_blank">Help</a>
            </footer>
      </article>
    </section>
    
    <script src="js/vendor/jquery-1.9.1.min.js" ></script>
    <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" ></script>
    <script src="js/vendor/jquery-ui-1.10.2.custom.min.js" ></script>
    <script src="js/base.js" ></script>
    <script src="js/signup.js" ></script>
</body>
</html>