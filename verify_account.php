<?php
    session_start();
    session_regenerate_id(true);
    
    if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        header('Location: index.php?' . session_name() . '=' . session_id());
        exit();
    }
    

    require_once('php/db-interface.php');
    
    
    function login() {    
        if( isset($_POST['username']) &&
            isset($_POST['password'])) {
                
            $name = htmlspecialchars($_POST['username']);
            $password = $_POST['password'];
            if(dbVerifyLogin($name, $password)) {
                $_SESSION['logged_in'] = true;
                $_SESSION['name'] = htmlspecialchars($name);
                $_SESSION['password'] = $password;
                header('Location: index.php?' . session_name() . '=' . session_id());
                exit();
            } else {
                echo     '<div class="alert alert-error">
                             This Email/Username password combination is invalid.
                          </div>';
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
            <?php
                $VERIFY_SUCCESS = '<p class="desc">Meet other enthusiasts all across the web and chat with them.</p>';
                $VERIFY_ERROR_ALREADY_VERIFIED = '<p class="desc">Your account has already been verified! (:</p>';
                    

            ?>
            

            <p>I don't have an account. <a href="signup.php">Register</a>.</p>
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
    <script src="js/login.js" ></script>
</body>
</html>