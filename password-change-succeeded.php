<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">
<title>Metahill | Password change succeeded</title>
</head>
<body>
    <?php require_once('feature/header.php'); ?>
    
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1>Your password has been changed!</h1>
            <form method="post" id="action-chooser">
                <p class="desc">To sign in with it, <a href="logout.php">go here</a>.</p>
            </form>
            <footer>
                <a href="blog" target="_blank">Blog</a>&nbsp;|
                <a href="help" target="_blank">Help</a>
            </footer>
      </article>
    </section>
    
    <script src="js/vendor/jquery-2.0.3.min.js" ></script>
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