$(function() {

    function hideContentElements() {
        $('#login-chooser .content').each(function(i, e) {$(e).hide();});
    }

    function showContentElements() {
        $('#login-chooser .content').each(function(i, e) {$(e).show('slow');});
    }

    hideContentElements();
    setTimeout(function() {
        showContentElements();
    }, 0);


    (function focusLoginField() {
        $(document).ready(function() {
            setTimeout(function() {
                $('#login-native-username').focus();
            }, 500);
        });
    })();

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
                footer.css('bottom', '25px');
            }

            // set background
            var headerSize = 100;
            if(location.pathname.indexOf('embedded') !== -1) {
                headerSize = 0;
            }
            
            var containerHeight = $(window).height()-headerSize;
            containerHeight = Math.max(containerHeight, 600);
            $('#main-container').height(containerHeight);
        };
    })());

    $(window).ready(function() {
        $(window).resize();
    });
});


