<?php
    session_start();
    session_regenerate_id(true);
    
    require_once("php/db-interface.php");

    function submitAccountActivationEmail($name, $to) {
        $subject = "Activate your metahill account";

        $verificationLink = "http://www.metahill.com/activate-account.php?name=" . $name . "&email=" . $to . "&code=" . hlpCreateAccoutActivationCode($name, $to);
        $message = file_get_contents("feature/verify_email.html");
        $message = str_replace("::name::", $name, $message);
        $message = str_replace("::verification_link::", $verificationLink, $message);


        $headers = "From: welcome@metahill.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

        return mail($to, $subject, $message, $headers);
    }
    
    function verifyInput($name, $password, $email) {
        $lenName = strlen($name);
        $lenPassword = strlen($password);
        $lenEmail = strlen($email);

        if($lenName < 3) {
            echo "Please choose a username with at least 3 characters.";
            return false;
        }
        if($lenName > 20) {
            echo "Please choose a username with not more than 20 characters."; 
            return false;    
        }
        if($lenEmail < 6) {
            echo "An email address with less than 8 characters? <i>REALLY?!</i> Not with us.";
            return false;    
        }
        if($lenEmail > 100) {
            echo "An email address with over 100 characters? <i>REALLY?!</i> Not with us."; 
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
                return;
            }
            
            if(dbUserNameExists($name)) {
                echo "<div class=\"alert alert-error\">";
                echo "The username <b>$user</b> already exists!";
                echo "</div>";
                return;
            }

            // TODO user check + create account should be one transaction!
            // TODO no multiple emails
            
            $ret = dbAddAccount($name, $password, $email);
            
            
            if($ret) {
                $_SESSION["logged_in"] = true;
                $_SESSION["name"] = htmlspecialchars($name);
                $_SESSION["password"] = $password;
                $_SESSION["verified"] = false;
                if(submitAccountActivationEmail($name, $email)) {
                    header("Location: signup-succeeded.php?" . session_name() . "=" . session_id());
                } else {
                    echo "mail() returned FALSE.";
                }
            } else {
                echo "<div class=\"alert alert-error\">";
                echo "We did something wrong. Sorry.";
                echo "</div>";
            }
            
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php
    require_once("feature/head.php");
?>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <?php require_once("feature/header.php"); ?>
    
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1>Join metahill today!</h1>
            <form method="post" id="action-chooser">
                <p class="desc">Sign up using Email</p>
                
                <input type="text" placeholder="Username" name="username" id="reg_name" value="<?php if(isset($_POST["username"])) echo htmlspecialchars($_POST["username"]); ?>" />
                <span class="label"></span>
                <input type="text" placeholder="Email" name="email" id="reg_email" value="<?php if(isset($_POST["email"])) echo htmlspecialchars($_POST["email"]); ?>" />
                <span class="label"></span>
                <input type="password" placeholder="Password" name="password" id="reg_password" />
                <span class="label"></span>
                

                <input type="submit" value="Sign up" class="btn btn-success" />
                <?php createUser(); ?>
            </form>
            <p>I have an account. <a href="login.php">Sign in</a>.</p>
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