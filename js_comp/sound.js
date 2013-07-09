function __sound__(a){this.playUserAddressed=function(){var b=new Audio("sound/user-addressed.wav");return function(){a.preferences.enable_notification_sounds&&b.play()}}()};
