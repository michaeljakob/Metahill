/**
 * File included by -all- main php files.
 */

var metahill = {};
function __base__() {
    var base = this;
    this.isInternetExplorer = function() {
        return navigator.appName.indexOf('Microsoft') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1;
    };

    if(base.isInternetExplorer() && window.location.toString().indexOf('get-a-modern-browser') === -1) {
        window.location = 'http://www.metahill.com/get-a-modern-browser.php';
    }
}

new __base__();