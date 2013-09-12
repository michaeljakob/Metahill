metahill.html = {};


metahill.html.getPrivateRoomImage = function() {
    return '<img src="img/icon/private.png" class="is-private" alt title="This room is password protected"/>';
};

metahill.html.getSettingsButton = function() {
    return  '<button class="btn" id="room-settings" alt="Room Settings" title="Room Settings" href="#modal-room-pref" data-toggle="modal">'+
                '<img alt="" src="img/icon/room_settings.png"/>Room Settings'+
            '</button>';
};

metahill.html.getSettingsOwnerMenu = function() {
    return '<span id="modals-room-pref-admins-box">'+
                '<h3>Room moderators</h3>'+
                '<p>Moderators ("mods") can change the topic and kick users. Separate individuals with a comma. The founder must not be listed explicitly.</p>'+
                '<input id="modals-room-pref-admins" type="text" placeholder="Room administrators" />'+
            '</span>';
};