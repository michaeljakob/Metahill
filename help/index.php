<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="../css/base.css">
<link rel="stylesheet" type="text/css" href="css/help.css">
<title>Metahill | Help</title>

</head>
<body>
    <a name="#top"></a>
    <header>
        <a href="../"><img src="../img/metahill.png" alt="metahill icon" /></a>
    </header>
    
    <section id="main-container">
        <article>
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

                                $out = '';
                                foreach($texts as $text) {
                                    $name = substr($text, strrpos($text, '/')+1, -4);
                                    $out .= "<tr>";
                                    $out .= "    <td><img src='$text' alt='$name'/></td>";
                                    $out .= "    <td>:". $name ."</td>";
                                    $out .= "    <td>". getSpecial($name) ."</td>";
                                    $out .= "</tr>";
                                }
                                echo $out;

                                function getSpecial($name) {
                                    // must be inverse array to the one in format-messages.js
                                    $smilies = array();
                                    $smilies['smile'] = ':), :-), =)';
                                    $smilies['biggrin'] = ':D, :-D, =D';
                                    $smilies['wink'] = ';), ;-), ;D, ;-D';
                                    $smilies['confused'] = ':?, :-?';
                                    $smilies['sad'] = ':(, :-(';
                                    $smilies['crying'] = ':\'(';
                                    $smilies['pinch'] = '>.<, >_<';
                                    $smilies['cool'] = '=8-)';
                                    $smilies['unsure'] = ':S, :s';
                                    $smilies['squint'] = '^^';
                                    $smilies['love'] = '<3';

                                    if(array_key_exists($name, $smilies)) {
                                        return htmlspecialchars($smilies[$name]);
                                    } else {
                                        return "";
                                    }
                                }
                            ?>
                        </tbody>
                    </table>
                    <h1>Formatting<a href="#top"><img class="anchor" title="go to top" src="img/up.png"/></a></h1>
                    <p>
                        Add some formatting to your messages to emphasize important parts and make others easier comprehend.
                        Doing so is tremendousley easy, just wrap your text into a special symbol.
                        <ul>
                            <li><b>*bold*</b></li>
                            <li><i>_italics_</i></li>
                            <li><code>`code`</code></li>
                        </ul>
                    </p>
                    <h1>Share images<a href="#top"><img class="anchor" title="go to top" src="img/up.png"/></a></h1>
                    <p>
                        You want to share images? A business-plan, a table or a funny cat. Whatever it might be, it is super easy. 
                        Just drag the image from your desktop into the chat window, then drop it. And we'll do the rest.
                    </p>
                    <div id="example-share-images">
                        <p>In the following example, I try to share a super funny picture of a rabbit with a pancake on its head. All I do is drag-and-dropping the desired image into metahill tab. </p>
                        <img src="img/share-images-drag-and-drop.jpg" alt="Share images via drag and drop on metahill" />
                        <p>Yaay, it worked! :)</p>
                        <img src="img/share-images-dropped.jpg" alt="Share images via drag and drop on metahill" />
                        <p>If I want to take a closer look at the image I just move my mouse cursor over it, and it will magnify. This is especially useful for images with diagrams and text.</p>
                        <img src="img/share-images-magnify.jpg" alt="Magnify images that were shared via metahill" />
                    </div>
                </div>
                <div class="tab-pane active" id="why-metahill">
                    <h1>Why metahill?</h1>
                    <p>
                        We think that metahill is unique in the way that it combines several established and amazing technologies and takes out the best each, for your benefit.
                        For a variety of reasons -which are listed below- we think metahill surpasses email, forums, facebook, twitter, <a href="http://en.wikipedia.org/wiki/Internet_Relay_Chat">IRC</a> and <a href="http://en.wikipedia.org/wiki/Usenet_newsgroup">Usenet newsgroups</a>.
                        Therefore we invite you to read through our points to <u>make your own decision</u> afterwards.
                    </p>
                    <ol>
                        <li>
                            <h2>Uniformity</h2>
                            <p>
                                metahill looks everywhere exactly the same. It is optimized for your Mac and your PC. For your tablet and your mobile phone.
                            </p>
                        </li>
                        <li>
                            <h2>It is easy to get involved</h2>
                            <p>
                                Creating an account doesn't even take 20 seconds. A username, an email and a password. That's it.
                            </p>
                        </li>
                        <li>
                            <h2>It is lightning fast</h2>
                            <p>
                                No flash, no silverlight and no java applets. With open-standard techniques HTML5, CSS3 and JavaScript
                                metahill.com works everywhere and is incredibly fast among all devices. And you don't get annoyed by
                                installing arbitrary plugins.
                            </p>
                        </li>
                        <li>
                            <h2>No desktop client needed</h2>
                            <p>
                                If you don't need a client, you don't need an installer. No waiting (for installations), no annoying updating and no potential malware.
                            </p>
                        </li>
                        <li>
                            <h2>We're organized</h2>
                            <p>
                                Messaging happens within rooms that have (more or less) a specific topic. These might be <i>@english</i>, <i>@math</i>, <i>@linux</i>, <i>@java</i>, <i>@design</i>, <i>@apple</i>, <i>...</i> 
                                The list is endless because literally <i>everyone</i> is allowed to create new rooms. Organization &amp; and categorization are two of the most important things when exchanging information.
                                And facebook and twitter are lacking both of them.
                            </p>
                        </li>
                        <li>
                            <h2>Beyond text</h2>
                            <p>
                                You can send way more than just plain text. You can make text bold, italics and you can even make it look like programming code. 
                                Sharing images has never been this easy ever before: just drag and drop one into the chat window. We support all the most common image formats, including png, jpg, gif and svg.
                            </p>
                        </li>
                        <li>
                            <h2>Never again miss anything</h2>
                            <p>
                                All chat messages are logged for five days. You can look up what people said even if you were offline at this time.
                             After five days these messages are deleted completely and permanently. There is no option to recover them. This 5-day limit 
                             has been created by users - <a href="#">make your vote count</a> if you think that is too long or short.
                         </p>
                        </li>
                        <li>
                            <h2>Behind all this is an open community</h2>
                            <p>
                                Everything you see here has been created by engaged professionals in their spare time. All members -no matter for how long- can participate in <a href="#">forum</a>
                                discussions where <i>we all</i> decide what's going to happen next. New features and the modification of existing ones - everything from design to functionality is decided by you.
                                Additionally, we maintain a <a href="#">blog</a> to keep interested users posted, ask for feedback and make polls.
                                At IRC disputes are very commonly only about <i>hating</i>, <i>egocentricity</i> and <i>power</i>. We try to be different. If you encounter any issues, get in touch with the support.
                            </p>
                        </li>
                        <li>
                            <h2>It is easy to use</h2>
                            <p>
                                metahill entails a beautiful design that follows function. We offer free community-driven support for everyone. Join the staff room <code>@metahill</code> or write us an <a href="mailto:support@troubi.com">email</a>. 
                                And the best: you don't have to get familiar with a whole new bunch of terminal-like commands to even log in (we're referring to IRC here).
                            </p>
                        </li>
                    </ol>
                    <p>
                        Tell us what your favorite feature of metahill is: <a href="#">What do you like most about metahill?</a>.
                    </p>

                </div>
                <div class="tab-pane" id="support">
                    <h1>I still got a question</h1>
                    <p>
                        If you couldn't find here what you were looking for there are basically two steps
                        you can take next.
                    </p>
                    <ol>
                        <li>Ask in the room named <code>@metahill</code> to get live-support&nbsp;<span class="label ">recommended</span></li>
                        <li>Write us an email at <a href="mailto:support@troubi.com">support@troubi.com</a></li>
                    </ol>
                    <p>
                        Although we're trying to answer all emails within 12 hours, in special cases it might take a bit longer.
                        You surely are better off if you try asking in <code>@metahill</code>, since you're
                        likely to get a reliable answer within a few minutes.
                    </p>
                </div>
            </div>
        </article>
    </section>
    
    <script src="../js/vendor/jquery-2.0.2.min.js" ></script>
    <script src="../js/vendor/modernizr-2.6.2-respond-1.1.0.min.js" ></script>
    <script src="../js/vendor/bootstrap.min.js" ></script>
    <script src="../js/helper.js" ></script>
    <script src="../js/base.js" ></script>
    <script>
        $('#help-sections a').click(function(e) {
            e.preventDefault();
            $(this).tab('show');
        });

    </script>
</body>
</html>















