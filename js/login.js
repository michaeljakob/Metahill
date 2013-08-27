$(function() {
    // remove "add-new-room"-popover if you click anywhere
    $('body').on('click', function (e) {
        $('#login-native-button').each(function() {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $('#action-chooser').submit(function() {
        var userName = $('[name=\'username\']');
        var password = $('[name=\'password\']');
        
        return $.trim(userName.val()).length > 0 && $.trim(password.val()).length > 0;
    });

    $(window).resize((function() {
        var footer = $('footer');

        return function() {
            // set footer bar
            var h = $(window).height();
            if(h < 685) {
                footer.css('bottom', h - 635);
            } else {
                footer.css('bottom', '50px');
            }

            // set background
            var headerSize = 100;
            if(location.pathname.indexOf('embedded') !== -1) {
                headerSize = 0;
            }
            
            $('#main-container').height($(window).height()-headerSize);
        };
    })());

    $(window).ready(function() {
        $(window).resize();
    });
});


