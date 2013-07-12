/// jshint settings
/*global window, document, $, */

$(function() {
    var interval = 1000 * 60 * 10; // all ten minutes

    var tips = [];
    tips.push('<b>Share images</b> by dragging them in the chat.');
    tips.push('Don\'t want to miss anything? View the chat logs.');
    tips.push('Put your message within * to make it <i>italics</i>.');
    tips.push('Put your message within ** to make it <b>bold</b>.');
    tips.push('Put your message within ` to make it <code>code</code>.');
    tips.push('<b>metahill</b> is a non-for-profit service.');
    tips.push('Join <b>@metahill</b> for metahill-questions &amp; feedback.');
    tips.push('We visualize over 25 smilies. View the <a href="help/index.php?tab=messages&anchor=smilies" target="_blank">list</a>.');
    tips.push('Hold and drag rooms to change their order.');
    tips.push('Be nice to your mates and keep the overall atmosphere nice. :)');
    //tips.push('');
    //tips.push('');
    //tips.push('');

    setTimeout(function() {
        setInterval(function() {
            if(metahill.modals.preferences.enable_tips && metahill.chat.isOnline) {
                var tip = tips[Math.floor(Math.random()*tips.length)];
                metahill.main.setCurrentStatus(tip, 'alert-info', 10000);
            }

        }, interval);
    }, interval);
});