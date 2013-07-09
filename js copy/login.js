$(function() {

    $('#action-chooser').submit(function() {
        var userName = $('[name=\'username\']');
        var password = $('[name=\'password\']');
        
        return $.trim(userName.val()).length > 0 && $.trim(password.val()).length > 0;
    });

    var login = this;
    this.footer = $('footer');
    this.window = $(window);
    $(window).resize(function() {
        var h = login.window.height();
        if(h < 685) {
            login.footer.css('bottom', h - 635);
        } else {
            login.footer.css('bottom', '50px');
        }
    });

    $(window).ready(function() {
        $(window).resize();
    });
});


