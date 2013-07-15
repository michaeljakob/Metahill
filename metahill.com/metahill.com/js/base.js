/**
 * File included by -all- main php files.
 */

var metahill = metahill || {};
metahill.base = {};
metahill.base.support = {};

$(function() {
    var toLowerUserAgent = navigator.userAgent.toLowerCase();

    // browsers
    metahill.base.support.isChrome = toLowerUserAgent.indexOf('chrome') > -1;
    metahill.base.support.isOpera = toLowerUserAgent.indexOf('opera') > -1;
    metahill.base.support.isFirefox = toLowerUserAgent.indexOf('firefox') > -1;
    metahill.base.support.isInternetExplorer = navigator.appName.indexOf('Microsoft') > -1 || toLowerUserAgent.indexOf('msie') > -1;

    // operating systems
    metahill.base.support.isMac = navigator.platform.toLowerCase().indexOf('mac') > -1;
    metahill.base.support.isWindows = navigator.appVersion.indexOf('Win') > -1;

    if(metahill.base.support.isInternetExplorer && window.location.toString().indexOf('get-a-modern-browser') === -1) {
        window.location = 'http://www.metahill.com/get-a-modern-browser.php';
    }
});
