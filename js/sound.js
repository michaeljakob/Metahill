/// jshint settings
/*global document*/

metahill.sound = {};

metahill.sound.playUserAddressed = function() {
    var snd = new Audio("sound/user-addressed.wav"); // buffers automatically when created

    return function() {
        if(metahill.modals.preferences.enable_notification_sounds){
            snd.play();
        }
    };
}();


