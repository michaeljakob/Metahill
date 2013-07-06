<?php
    session_start();
    session_regenerate_id(true);

    function activateAccount() {
        $ERROR = 'I could not activate that. :(';
        $SUCCESS = 'Your account has been activated!';

        if(!isset($_GET['name']) || !isset($_GET['code']) || !isset($_GET['email'])) {
            return $ERROR;
        }

        $name = $_GET['name'];
        $code = $_GET['code'];
        $email = $_GET['email'];

        require("php/db-interface.php");
        $generatedCode = hlpCreateAccoutActivationCode($name, $email);
        if($generatedCode == $code) {
            $_SESSION['verified'] = true;
            return $SUCCESS;
        }

        return $ERROR;
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Activate account</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1><?php echo activateAccount(); ?></h1>
            <form method="post" id="action-chooser">
            </form>
            <p class="desc" id="redirect-message">We redirect you to the main page</p>
            <footer>
                <a href="forum" target="_blank">Forum</a>&nbsp;|
                <a href="help" target="_blank">Help</a>
            </footer>
      </article>
    </section>
    
    <script src="js/vendor/jquery-2.0.2.min.js" ></script>
    <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" ></script>
    <script src="js/vendor/jquery-ui-1.10.2.custom.min.js" ></script>
    <script src="js/base.js" ></script>
    <script src="js/signup.js" ></script>
    <script type="text/javascript">
        var redirectMessage = $('#redirect-message');

        function addDot() { redirectMessage.html('&nbsp;' + redirectMessage.html() + '.'); }
        for(var i=0; i<3; ++i) {
            setTimeout(addDot, i * 1000);
        }
        setTimeout(function() { 
            window.location = 'index.php';
         }, 3000);
    </script>
</body>
</html>