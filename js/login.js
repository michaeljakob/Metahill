$(function() {

    $("#action-chooser").submit(function() {
        var userName = $("[name='username']");
        var password = $("[name='password']");

        return function() {
            return $.trim(userName.val()).length > 0 && $.trim(password.val()).length > 0;
        }();
    });

    $(window).resize(function() {
        var h = $(window).height();
        if(h < 685) {
            $("footer").css("bottom", h - 635);
        } else {
            $("footer").css("bottom", "50px");
        }
    });

    $(window).ready(function() {
        $(window).resize();
    });
});