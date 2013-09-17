<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<meta name="description" content="Metahill is the easiest way to chat, text, message and share images in real time with other enthusiasts all across the web. The ability to exchange a lot of information including diagrams and links real-time makes it a first class business solution.">
<meta name="author" content="">
<meta name="keywords" content="free chat rooms, free chat, chat, chatrooms, chat-room, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">
<link rel="canonical" href="https://www.facebook.com/metahillcommunity"/>
<link rel="icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="http://www.metahill.com/favicon.ico" type="image/x-icon" />


<link rel="stylesheet" type="text/css" href="../css/base.css">
<link rel="stylesheet" type="text/css" href="../css/documentation.css">
<title>Metahill | Help</title>

</head>
<body>
    <a id="#top"></a>
    <header>
        <a href="../"><img src="../img/metahill.png" alt="metahill icon" /></a>
    </header>

    <section id="main-container">
        <ul class="nav nav-tabs" id="help-sections">
            <li class="active"><a href="#why-metahill" data-toggle="tab">Why Metahill?</a></li>
            <li><a href="#messages" data-toggle="tab">Messages</a></li>
            <li><a href="#support" data-toggle="tab">I still got a question</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" id="messages">
                <h1>Smilies</h1>
                <p>
                    Metahill offers almost 30 different smilies. You can make them by writing
                    a colon <code>:</code> followed by the smilie-name, e.g. <code>:love</code>. The most common text-smilies such as <code>:D</code> are 
                    also replaced automatically. If you don't wish us to replace smilies with smilie-images, disable it in your preferences.
                </p>
                <table class="smilies">
                    <thead>
                        <tr>
                            <th>Look</th>
                            <th>Name</th>
                            <th>Inline form(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $directory = "../img/smilies/";
                            $texts = glob($directory . "*.png");

                            foreach($texts as $text) {
                                $name = substr($text, strrpos($text, '/')+1, -4);
                                echo "<tr>";
                                echo    "<td><img src='$text' alt='$name'/></td>";
                                echo    "<td>:". $name ."</td>";
                                echo    "<td>". getSpecial($name) ."</td>";
                                echo "</tr>";
                            }

                            function getSpecial($name) {
                                // must be inverse array to the one in format-messages.js
                                $smilies = array();
                                $smilies['smile'] = ':), :-), =)';
                                $smilies['biggrin'] = ':D, :-D';
                                $smilies['wink'] = ';), ;-), ;D, ;-D';
                                $smilies['confused'] = ':?, :-?';
                                $smilies['sad'] = ':(, :-(';
                                $smilies['crying'] = ':\'(';
                                $smilies['pinch'] = '>.<, >_<';
                                $smilies['unsure'] = ':S, :s';
                                $smilies['squint'] = '^^';
                                $smilies['love'] = '<3';
                                $smilies['tongue'] = ':P; :p';

                                if(array_key_exists($name, $smilies)) {
                                    return htmlspecialchars($smilies[$name]);
                                } else {
                                    return "";
                                }
                            }
                        ?>
                    </tbody>
                </table>
                <h1>Formatting<a href="#top"><img class="anchor" title="go to top" alt="go to top" src="img/up.png"/></a></h1>
                <p>
                    Add some formatting to your messages to emphasize important parts and make others easier comprehend.
                    Doing so is tremendously easy, just wrap your text into a special symbol.
                </p>
                <ul>
                    <li><b>*bold*</b></li>
                    <li><i>_italics_</i></li>
                    <li><code>`code`</code></li>
                </ul>
                <h1>Users with fancy icons before their names</h1>
                <p>
                    Those are usually admins, mods or room administrators.
                    <img class="example" src="img/colored-usernames-and-messages.png" alt="" />
                </p>
                <h1>Share images<a href="#top"><img class="anchor" title="go to top" alt="go to top" src="img/up.png"/></a></h1>
                <p>
                    You want to share images? A business-plan, a table or a funny cat. Whatever it might be, it is super easy. 
                    Just drag the image to <a href="http://www.metahill.com/">metahill.com</a>, then drop it. Yeah, that's it.
                </p>
                <div>
                    <p>In the following example, I try to share a cute squirrel with my friends. All I do is drag-and-dropping the desired image into the metahill tab. </p>
                    <img class="example" src="img/share-images-drag-and-drop.jpg" alt="Share images via drag and drop on metahill" />
                    <img class="example" src="img/share-images-dropped.jpg" alt="Share images via drag and drop on metahill" />
                    <p>If I want to take a closer look at the image I just move my mouse over it, and it will magnify on the right hand side. This is especially useful for images with diagrams or text.</p>
                    <img class="example" src="img/share-images-magnify.jpg" alt="Magnify images that were shared via metahill" />
                </div>
            </div>
            <div class="tab-pane active" id="why-metahill">
                <h1>Why metahill?</h1>
                <p>
                    We think that <a href="http://www.metahill.com/">metahill</a> is unique in the way that it combines several established and amazing technologies and takes out the best of each, for your benefit.
                    For a variety of reasons -which are listed below- we think metahill surpasses email, forums, facebook, twitter, <a href="http://en.wikipedia.org/wiki/Internet_Relay_Chat">IRC</a> and <a href="http://en.wikipedia.org/wiki/Usenet_newsgroup">Usenet newsgroups</a>.
                    The goal of <a href="http://www.metahill.com">metahill</a> is not to replace them, but to complement them. 
                    We created a small list enumerating some of the most significant features for you and push you to <u>fell your own decision</u> afterwards.
                </p>
                <ol>
                    <li>
                        <h2>Uniformity across all devices</h2>
                        <p> 
                            Since all you need to do is visiting <a href="http://www.metahill.com">metahill.com</a> and
                            a browser is installed on practically each system, metahill is similarily available almost everywhere.
                            Metahill comes with a consistently nice look-and-feel across all platforms and devices.
                            It is optimized for your Mac and your PC. For your tablet and your mobile phone.
                        </p>
                    </li>
                    <li>
                        <h2>It is easy to get involved</h2>
                        <p>
                            Creating an account doesn't even take 20 seconds. A username, an email and a password. That's it.
                            Alternatively, you can login with your facebook account. That would be one click. :)
                        </p>
                    </li>
                    <li>
                        <h2>It is lightning fast, thanks to open standards</h2>
                        <p>
                            No flash, no silverlight and no insecure Java applets.
                            With open webstandards, namely HTML5, CSS3, JavaScript and 
                            <a target="_blank" href="https://www.dartlang.org">Dart</a>
                            metahill gains a great performance boost and stays future proof at the same time.
                            And what's more: you don't get annoyed with installing shady plugins.
                        </p>
                    </li>
                    <li>
                        <h2>No desktop client needed</h2>
                        <p>
                            If you don't need a locally installed client, you're always on the secure side.
                            No waiting for long installations, no annoying updating and no potential malware.
                            All you do is visiting <a href="http:/www.metahill.com">www.metahill.com</a>.
                        </p>
                    </li>
                    <li>
                        <h2>We're organized</h2>
                        <p>
                            Messaging happens within rooms that have (more or less) a specific topic. 
                            These might be <i>english</i>, <i>math</i>, <i>linux</i>, <i>java</i>, <i>design</i>, <i>apple</i>, <i>...</i> 
                            The list is endless because literally <i>everyone</i> is allowed to create new rooms. 
                            Organizing &amp; categorizing data are the two most vital mechanisms when exchanging information, 
                            we thought of this rule in every line of code that was written.
                            Yet, we are staggered neither facebook nor twitter are implementing these strategies properly.
                        </p>
                    </li>
                    <li>
                        <h2>Beyond text</h2>
                        <p>
                            You can send way more than just plain text.
                            You can make text bold, italics and you can even make it look like programming code. 
                            Sharing images has never been this easy ever before: just drag'n'drop a picture into the chat window and marvel.
                            We support all of the most common image formats including png, jpg, gif and svg.
                        </p>
                    </li>
                    <li>
                        <h2>Never again miss anything</h2>
                        <p>
                            All chat messages are logged for three days.
                            You can look up what people said even if you were offline at this time.
                            After three days all data is deleted completely and permanently. We do not make exceptions.
                            There is no option to recover them.
                            The 3-day limit has been created by users. If you think that is too long or too short, let us know.
                        </p>
                    </li>
                    <li>
                        <h2>Behind all this is an open community</h2>
                        <p>
                            Everything you see here has been created by engaged professionals in their spare time.
                            All members are invited to participate in <a href="../blog">blog</a>
                            discussions where <u>we all</u> collaborately decide what's going to happen next.
                            If you encounter any issues, ask in the room <code>metahill</code> or get in touch with the support.
                        </p>
                    </li>
                    <li>
                        <h2>Metahill is simple to use</h2>
                        <p>
                            <a href="http://www.metahill.com/">Metahill</a> entails a beautiful design that follows functionality.
                            You will free community-driven support for everyone, where users help users.
                            Join the general help room <code>metahill</code> or write us an <a href="mailto:support@metahill.com">email</a>
                            if there is anything you want us to hear about. 
                        </p>
                    </li>
                    <li>
                        <h2>Community-revised code on German servers</h2>
                        <p>
                            Every single one of our servers was intentionally set-up and configured
                            in <a href="https://maps.google.com/?output=embed&t=h&q=Karlsruhe%20&z=5">Karlsruhe, Germany</a>.
                            In times of NSA and PRISM, we think that was a great decision.
                            Additionally, huge parts of metahill interns are layed out to the public. This simply means
                            that everyone may easily read through the code oneself and approve it.
                        </p>
                    </li>
                </ol>
            </div>
            <div class="tab-pane" id="support">
                <h1>Hmmm. I still got a question</h1>
                <p>
                    We greatly appreciate any form of constructive feedback, bug-reports and feature requests.
                    Hence, don't fear to get in touch with us :).
                    There are basically two steps you can take next.
                </p>
                <ol>
                    <li>Ask in the room <code>metahill</code> to get live-support.
                        <a href="http://www.metahill.com/join/metahill">Join the room <code>metahill</code> now</a>.</li>
                    <li>Write us an email. Our address is <a href="mailto:support@metahill.com">support@metahill.com</a>.</li>
                </ol>
                <p>
                    Although we're trying to answer all emails within 12 hours, it might take a bit longer in some special cases.
                    You surely are better off if you try asking in <code>metahill</code>, since you're
                    likely to get a reliable answer within a few seconds.
                </p>
                <h1>Logal notice</h1>
                <p>
                    Michael Jakob<br>
                    94577 Winzer, Bavaria, Germany<br>
                    Am Sand 4</br>
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