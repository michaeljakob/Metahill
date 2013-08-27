/// jshint settings
/*global window, document, $, */

$(function() {
    var interval = 1000 * 60 * 10; // all ten minutes

    var tips = [];

    // metahill tips & tricks
    tips.push('<b>Share images</b> by dragging them in the chat.');
    tips.push('Don\'t want to miss anything? View the chat logs.');
    tips.push('Enclose your text in _ to make it <i>italics</i>.');
    tips.push('Enclose your text in * to make it <b>bold</b>.');
    tips.push('Enclose your text in ` to make it <code>code</code>.');
    tips.push('<b>metahill</b> is a non-for-profit service.');
    tips.push('Join the <b>metahill</b>-room to give us feedback.');
    tips.push('We visualize over 25 smilies. <a href="help/index.php?tab=messages&anchor=smilies" target="_blank">View the list</a>.');
    tips.push('Hold and drag rooms to change their order.');
    tips.push('Try to use up- and down-arrows at the input field.');
    tips.push('Use <b>/r</b> to quickly respond to a whisper.');
    tips.push('Use ALT+1, ALT+2 to join the first, second room and so on.');
    tips.push('Have you already tried <b>/youtube</b>?');
    tips.push('Oh gosh, I love to use <b>/map</b>!');
    tips.push('What are you doing right now? Tell us with <b>/me</b>.');
    tips.push('Leave the current room by typing <b>/quit</b>.');
    tips.push('Join a room by typing <b>/join <name></b>.');

    // motivational, jokes
    tips.push('Be nice to your mates. :)');
    tips.push('An apple a day keeps the doctor away. :)');
    tips.push('Why is six scared of seven? Because seven eight nine');
    tips.push('If you can’t convince them, confuse them.');
    tips.push('If the world didn\'t suck, we\'d all fall off.');
    tips.push('Why is abbreviation such a long word?');
    tips.push('What do you call a deer with no eyes? I have no I-Deer');
    tips.push('We know that 69 % of people find something dirty in everything.');
    tips.push('What is brown and sticky? A stick!');
    tips.push('Knock, knock. Who\'s there? Tank. Tank who? You\'re welcome!');
    tips.push('What the mind can conceive, it can achieve.');
    // tips.push('');
    // tips.push('');
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