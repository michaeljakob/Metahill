<?php
    session_start();
    session_regenerate_id(true);
    
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Sign up succeeded</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">

</head>
<body>
    <section id="main-container" class="signup">
        <article id="welcome">
            <h1 class="shaded">Your account has been created!</h1><br>
            <form method="post" id="action-chooser">
                <p class="desc shaded">We have sent you an email.<br>
                Please check your inbox (+spam folder).</p>
            </form>
      </article>
    </section>
    
  <script src="js/vendor/jquery-2.0.3.min.js"></script>
  <script async src="js/login.js"></script>
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