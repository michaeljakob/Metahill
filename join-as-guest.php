<?php
    session_start();
    session_regenerate_id(true);

    if(isset($_POST['guestname'])) {
        $_SESSION['logged_in'] = true;
        $_SESSION['verified'] = true;
        $_SESSION['name'] = $_POST['guestname'];

        if(isset($_POST["source"])) {
            header("Location: {$_POST['source']}");
        } else {
            header("Location: index.php");
        }
        exit();
    }

    // generate guest name
    $guestName = "Guest";
    for($i = 0; $i < 4; ++$i) {
        $guestName .= (string) rand(1, 9);
    }

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Joining as a guest</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">
<style>
.guest-name {
    font-family: Courier New;
}

</style>
</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1>You will join metahill as</h1>
            <h1 class="guest-name"><?php echo $guestName; ?></h1>
            <form method="post">
                <input type="text" name="guestname" value="<?php echo $guestName; ?> " style="display:none;"/>
                <?php
                    if(isset($_GET['source'])) {
                        $source = $_GET['source'] . '?' . $_SERVER['QUERY_STRING'];
                        echo "<input style='display:none;' type='text' name='source' value='$source' ></input>";
                    }
                ?>
                <input class="btn btn-success" type="submit" value="Okay"></input>
            </form>
      </article>
    </section>
    
    <script src="js/vendor/jquery-2.0.3.min.js" ></script>
    <script src="js/vendor/jquery-ui-1.10.2.custom.min.js" ></script>
    <script src="js/base.js" ></script>
    
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