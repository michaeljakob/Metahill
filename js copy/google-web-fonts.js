$(function() {

    WebFontConfig = {
        google: { families: [ 'Noto+Sans::latin', 'Noto+Serif::latin'] }
    };

    (function() {
        var wf = document.createElement('script');
        wf.src =    ('https:' == document.location.protocol ? 'https' : 'http') +
                    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();

});