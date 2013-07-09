/// jshint settings
/*global document*/

function __sound__(modals) {

    this.playUserAddressed = function() {
        var snd = new Audio("sound/user-addressed.wav"); // buffers automatically when created

        return function() {
            if(modals.preferences.enable_notification_sounds){
                snd.play();
            }
        };
    }();
    
}


