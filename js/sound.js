/// jshint settings
/*global document*/

metahill.sound = {};

metahill.sound.play = function(soundName) {
    $('<embed src="sound/'+soundName+'" hidden="true" autostart="true" loop="false"></embed>').play();
};


metahill.sound.playUserAddressed = function() {
    if(metahill.modals.preferences.enable_notification_sounds){
        metahill.sound.play('user-addressed.wav');
    }
};


