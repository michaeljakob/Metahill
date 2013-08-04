<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Metahill | Get a modern browser</title>
<link rel="stylesheet" type="text/css" href="css/base.css">
<link rel="stylesheet" type="text/css" href="css/login.css">
<link rel="stylesheet" type="text/css" href="css/get-a-modern-browser.css">

</head>
<body>
    <header>
        <a href="../"><img src="img/metahill-lowres.png" alt="metahill icon" /></a>
    </header>
    
    <section id="main-container">
        <article id="welcome">
            <h1>We don't support Internet Explorer</h1>
            <span>In order to access <b>metahill</b>, please get a state-of-the art browser.
                <br>We have picked out four, which we think are very sensible.</span>
            <ul id="browser-list">
                <li>
                    <a target="_blank" href="https://www.google.com/intl/en/chrome/">
                        <img src="img/browser/chrome.png" alt="Google Chrome">
                        <span>Chrome</span>
                    </a>
                </li>
                <li>
                    <a target="_blank" href="http://www.mozilla.org/en-US/firefox/new/">
                        <img src="img/browser/firefox.png" alt="Mozilla Firefox">
                        <span>Firefox</span>
                    </a>
                </li>
                <li>
                    <a target="_blank" href="http://support.apple.com/downloads/#safari">
                        <img src="img/browser/safari.png" alt="Safari">
                        <span>Safari</span>
                    </a>
                </li>
                <li>
                    <a target="_blank" href="http://www.opera.com/computer">
                        <img src="img/browser/opera.png" alt="opera">
                        <span>Opera</span>
                    </a>
                </li>
            </ul>
            <footer>
                <span><a href="login.php">Sign in</a>&nbsp;|</span>
                <span><a href="signup.php">Sign up</a>&nbsp;|</span>
                <span><a href="blog" target="_blank">Blog</a>&nbsp;|</span>
                <span><a href="help" target="_blank">Help</a></span>
            </footer>
        </article>
    </section>
    
    <script src="js/vendor/jquery-2.0.3.min.js" ></script>
    <script src="js/base.js" ></script>
    <script>
        $(function() {
            if(!metahill.base.support.isInternetExplorer) {
                $('#browser-list').css('display', 'none');
                $('#welcome > h1').html('You\'re using a modern browser! :)');
                var welcome = $('#welcome > span');
                welcome.html('Forwarding you');

                function addDot() { welcome.html('&nbsp;' + welcome.html() + '.'); }
                for(var i=0; i<4; ++i) {
                    setTimeout(addDot, i * 1000);
                }
                setTimeout(function() { 
                    window.location = 'login.php';
                 }, 3000);
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