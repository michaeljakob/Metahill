
function __base__() {
    var base = this;
    this.isInternetExplorer = function() {
        return navigator.appName.indexOf('Microsoft') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1;
    };

    if(base.isInternetExplorer() && window.location.toString().indexOf('get-a-modern-browser') === -1) {
        window.location = 'get-a-modern-browser.php';
    }

    // change header icon on hover
    $('#company-icon').mouseover(function() {
        $(this).attr('src', 'http://www.metahill.com/img/metahill-hover.png');
    });
    $('#company-icon').mouseout(function() {
        $(this).attr('src', 'http://www.metahill.com/img/metahill.png');
    });

}

new __base__();