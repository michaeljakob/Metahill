/**
 * File included by -all- main php files.
 */

var metahill = metahill || {};
metahill.base = {};
metahill.base.support = {};

/**
 * metahill.base
 */
$(function() {
    metahill.base.isWindowFocused = true;

    var originalDocumentTitle = document.title;
    $(window).focus(function() {
        metahill.base.isWindowFocused = true;
        
        if(metahill.log !== undefined && metahill.log.unseenMessages !== undefined) {
            document.title = 'no-cache-in-chrome-for-windows';
            document.title = originalDocumentTitle;
            metahill.log.unseenMessages = 0;
        }
    });

    $(window).blur(function() {
        metahill.base.isWindowFocused = false;
    });
});

/**
 * metahill.base.support
 */
$(function() {
    var toLowerUserAgent = navigator.userAgent.toLowerCase();

    // browsers
    metahill.base.support.isChrome = toLowerUserAgent.indexOf('chrome') > -1;
    metahill.base.support.isOpera = toLowerUserAgent.indexOf('opera') > -1;
    metahill.base.support.isFirefox = toLowerUserAgent.indexOf('firefox') > -1;
    metahill.base.support.isInternetExplorer = toLowerUserAgent.indexOf('microsoft') > -1 || toLowerUserAgent.indexOf('msie') > -1;

    // operating systems
    metahill.base.support.isMac = navigator.platform.toLowerCase().indexOf('mac') > -1;
    metahill.base.support.isWindows = navigator.appVersion.indexOf('Win') > -1;

    // devices
    metahill.base.support.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    // functionality
    metahill.base.support.isAnimated = metahill.base.support.isChrome || metahill.base.support.isFirefox || metahill.base.support.isOpera;
    metahill.base.support.isEmbedded = window.location.pathname.indexOf('embedded.php') > -1;

    if(metahill.base.support.isInternetExplorer && window.location.pathname.indexOf('get-a-modern-browser.php') === -1) {
        window.location = 'http://www.metahill.com/get-a-modern-browser.php';
    }
});
