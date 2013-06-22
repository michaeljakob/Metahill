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
    
    <section id="main-container" class="not-found">
        <article id="welcome">
            <h1>Hm...</h1>
            <p class="desc">we can't find the page</p>
            <p class="desc">you're looking for</p>
            <br/><br/>
            <p>Do you want to <a href="login.php">Sign in</a> or <a href="signup.php">Sign up</a>?</p>
            <p>If you seek help for using this platform, <a href="help">go here</a>.</p>
            <footer>
                    <a href="blog" target="_blank">Blog</a>&nbsp;|&nbsp;
                    <a href="help" target="_blank">Help</a>
            </footer>
        </article>
    </section>
    
    <script src="js/vendor/jquery-1.9.1.min.js" ></script>
    <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" ></script>
    <script src="js/vendor/jquery-ui-1.10.2.custom.min.js" ></script>
    <script src="js/base.js" ></script>
    <script src="js/login.js" ></script>
</body>
</html>