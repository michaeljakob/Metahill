/// jshint settings
/*global document*/

function __sound__(modals) {

    this.playUserAddressed = function() {
        var audioTag = document.createElement('audio');
        audioTag.setAttribute('src', 'sound/user-addressed.mp3');

        return function() {
            if(modals.preferences.enable_notification_sounds){
                audioTag.play();
            }
        };
    }();
    
}


