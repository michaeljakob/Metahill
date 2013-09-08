<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!-- <base href="http://www.metahill.com/dev" /> -->
<meta name="description" content="Metahill is the easiest way to chat, text, message and share images in real time with other enthusiasts all across the web. The ability to exchange a lot of information including diagrams and links real-time makes it a first class business solution.">
<meta name="author" content="">
<meta name="keywords" content="free chat rooms, free chat, chat, chatrooms, chat-room, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">
<link rel="canonical" href="https://www.facebook.com/metahillcommunity"/>
<link rel="icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />


<link rel="stylesheet" type="text/css" href="../css/base.css">
<link rel="stylesheet" type="text/css" href="../css/documentation.css">
<title>Metahill | Developer</title>

</head>
<body>
    <a name="#top"></a>
    <header>
        <a href="../"><img src="../img/metahill.png" alt="metahill icon" /></a>
    </header>

    <section id="main-container">
        <ul class="nav nav-tabs" id="help-sections">
            <li class="active"><a href="#overview" data-toggle="tab">Overview</a></li>
            <li><a href="#embedding" data-toggle="tab">Embedding Metahill</a></li>
            <li><a href="#chat-api" data-toggle="tab">Chat Api</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="overview">
                <h1>Recent developer blog entries:</h1>
                <ul>
                    <li><a href="http://www.metahill.com/blog/custom-metahill-themes/">Custom themes</a></li>
                    <li><a href="http://www.metahill.com/blog/metahill-can-be-embedded-into-extern-websites/">Embedding rooms</a></li>
                    <li><a href="http://www.metahill.com/blog/join-rooms-by-visiting-a-url/">Join rooms by visiting a url</a></li>
                </ul>
            </div>
            <div class="tab-pane" id="embedding">
                <h1>Embedding the metahill client</h1>
                <p>
                    The greatest obvious advantage of embedding metahill is that your users can
                    stick on your page and use metahill at the same time.
                    This comes in handy if you want to give visitors the option to comment a live-stream,
                    some photos or your recent activity. You could even provide support using this fancy plugin!
                </p>
                <h1>Html code</h1>
                <p>
                    Embedding is done by using an <code>iframe</code>. You can freely insert the following
                    snippet to your page:
                    <p>
                        <pre>&lt;iframe src="http://www.metahill.com/embedded.php?room=metahill&amp;amp;size=mini" width="600" height="300" scrolling="no" frameborder="0"&gt;&lt;/iframe&gt;</pre>
                    </p>
                    This snippet will add the standard client linking to the metahill room. It should much look like this:
                </p>
                <p>
                    <iframe src="http://www.metahill.com/embedded.php?room=metahill&amp;size=mini" width="596" height="300" scrolling="no" frameborder="" style="border: 2px solid #ccc"></iframe>
                </p>
                <h1>Options for embedded.php</h1>
                <p>
                    All options for this client are passed as a <code>GET</code>-parameter in the url.
                    In the above example url, we specified the arguments <code>room</code> and <code>size</code>.
                    <table id="embedded-parameters">
                        <tr>
                            <td>Parameter</td>
                            <td>Default</td>
                            <td>Possible values</td>
                        </tr>
                        <tr>
                            <td>room</td>
                            <td>-</td>
                            <td>
                                Any existing room, e.g. <b>metahill</b>, <b>C++</b>, <b>english</b>, ...<br><br>
                                <span class="alert alert-warning">This is the only mandatory parameter.</span><br><br>
                            </td>
                        </tr>
                        <tr>
                            <td>size</td>
                            <td>normal</td>
                            <td>
                                <ul>
                                    <li><b>normal</b>: the default option</li>
                                    <li><b>mini</b>: no attendees bar, tiny buttons</li>
                                <ul>
                            </td>
                        </tr>

                        <tr>
                            <td>show-rooms-bar</td>
                            <td>false</td>
                            <td>
                                Set it to <b>true</b>, if you want to show the rooms-bar at the top.
                                If it is set to any other value, the rooms-bar will be hidden.
                            </td>
                        </tr>
                        <tr>
                            <td>hide-attendees-bar</td>
                            <td>false</td>
                            <td>
                                Set it to <b>true</b>, if you want the normal layout but still no
                                attendees bar
                            </td>
                        </tr>
                    </table>
                </p>
            </div>
            <div class="tab-pane" id="chat-api">
                <h1>We're not yet public</h1>
                <p>The server side chat-api is not yet public. We are still optimizing much over here.</p>
                <p>
                    Are you already interested in making use of a REST or similar api? Let us know!
                    The more requests we receive the harder we can push on this priority.
                </p>
            </div>
        </div>
    </section>
    <script src="../js/vendor/jquery-2.0.3.min.js" ></script>
    <script src="../js/vendor/bootstrap.min.js" ></script>
    <script>
        $('#help-sections a').click(function(e) {
            e.preventDefault();
            $(this).tab('show');
        });

        // activate a specific tab
        // $('#help-sections a').eq(1).tab('show');

    </script>
    
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





