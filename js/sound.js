/// jshint settings
/*global document*/

metahill.sound = {};

metahill.sound.playUserAddressed = function() {
    return function() {
        if(metahill.modals.preferences.enable_notification_sounds){
            (new Audio('sound/user-addressed.mp3')).play();
        }
    };
}();


