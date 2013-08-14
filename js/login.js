$(function() {

    $('#action-chooser').submit(function() {
        var userName = $('[name=\'username\']');
        var password = $('[name=\'password\']');
        
        return $.trim(userName.val()).length > 0 && $.trim(password.val()).length > 0;
    });

    $(window).resize((function() {
        var footer = $('footer');
        var windowC = $(window);

        return function() {
            var h = windowC.height();
            if(h < 685) {
                footer.css('bottom', h - 635);
            } else {
                footer.css('bottom', '50px');
            }
        };
    })());

    $(window).ready(function() {
        $(window).resize();

        var headerSize = 100;
        if(location.pathname.indexOf('embedded') !== -1) {
            headerSize = 0;
        }
        
        $('#main-container').height($(window).height()-headerSize);
    });
});


