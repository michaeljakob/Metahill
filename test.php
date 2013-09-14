<!DOCTYPE html>
<html lang="en">
<head>
    
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta name="description" content="Metahill is the easiest way to chat and share images in real time. The ability to exchange a lot of information including diagrams and links real-time makes it a first class business solution.">
<meta name="author" content="">
<meta name="keywords" content="instant messager, IM, instant messaging, free chat rooms, free chat, chat, chatrooms, chat-room, realtime, real-time, chat, share-images, share images, image upload, community based, community driven, adfree, free, better irc, enthusiasts, community-based, online meetings, troubi, social network, better facebook, better twitter, better google plus, facebook alternative, twitter alternative, metahill, troubi, fun, enthusiasts, experts, connection, network, community, forum, internet relay chat, usenet newsgroups, knowledge, science, learning, homework, self-helping, users help users">





<body>
    <h1>super awesome content</h1>

    <iframe id="metahill-client" src="http://127.0.0.1/metahill.com/embedded.php?room=codebot&amp;size=mini" width="600" height="300" scrolling="no" frameborder="0"></iframe>

    <script src="js/vendor/jquery-2.0.3.min.js" ></script>
<script>
$(document).ready(function () {
  window.addEventListener('message', function (e) {
    var r = JSON.parse(e.data) || {};
    if(r.action === 'loaded') {
      $('#metahill-client').load(function() {
        var data = {};
        data['user_highlight_colors'] = {};
        data['user_highlight_colors']['red'] = ['Michael'];
        data['user_highlight_colors']['#369'] = ['User1', 'User2'];

        var f = $('#metahill-client')[0].contentWindow;
        f.postMessage(JSON.stringify(data), '*');
      });
    }
  }, false);
});
</script>
</body>