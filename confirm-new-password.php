<?php

    // log out
    session_start();
    if(isset($_SESSION['logged_in'])) {
        $_SESSION['logged_in'] = false;
        session_destroy();
    }

    require_once "php/db-interface.php";
    $verificationId = "";

    if(isset($_POST["verification_id"]) && isset($_POST["new_password_1"]) && isset($_POST["new_password_2"])) {
        changePassword($_POST["verification_id"], $_POST["new_password_1"], $_POST["new_password_2"]);
    } else if(isset($_GET["verification_id"])) {

        $pcr = dbGetPasswordChangeRequest($_GET["verification_id"]);
        if($pcr === false) {
            header('Location: 404.php');
        }
    } else {
        header('Location: 404.php');
    }

    function changePassword($id, $pw1, $pw2) {
        require_once "php/db-interface.php";

        $pcr = dbGetPasswordChangeRequest($_GET["verification_id"]);
        if($pcr === false) {
            header('Location: 404.php');
        } else {
            dbConfirmPasswordChangeRequest($pcr->user_id, $pw1);
            header('Location: password-change-succeeded.php');
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Confirm new password</title>
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
            <p class="desc">Enter your new password below.</p>
            <p class="desc">For best security, use 8 or more characters.</p>
            <form method="post">
                <h2></h2><br>
                <input type="text" id="verification_id" name="verification_id" value="<?php echo $verificationId; ?>" style="display:none;" />
                <input type="password" id="new_password_1" pattern=".{8,30}" name="new_password_1" placeholder="Your new password" />
                <input type="password" id="new_password_2" pattern=".{8,30}" name="new_password_2" placeholder="Repeat your new password" />
                <input type="submit" disabled id="confirm-new-password" value="Save" class="btn btn-success" />
            </form>
        </article>
        <footer>
            <a href="login.php">Sign in</a>&nbsp;|
            <a href="signup.php">Sign up</a>&nbsp;|
            <a href="blog">Blog</a>&nbsp;|
            <a href="help">Help</a>
        </footer>

    </section>
    
    <script src="js/vendor/jquery-2.0.2.min.js"></script>
    <script async src="js/base.js" ></script>
    <script>
        $(function() {
            var storage = this;
            this.pass1 = this.pass2 = '';

            function updateUi() {
                var len = storage.pass1.length;
                if(storage.pass1 === storage.pass2 && len >= 8 && len <= 30) {
                    $('#confirm-new-password').removeAttr('disabled');
                } else {
                    $('#confirm-new-password').prop('disabled', true);
                }
            }

            $('#new_password_1').bind('propertychange keyup input paste', function() {
                storage.pass1 = $(this).val();
                updateUi();
            });

            $('#new_password_2').bind('propertychange keyup input paste', function() {
                storage.pass2 = $(this).val();
                updateUi();
            });
        });
    </script>
</body>
</html>