/// jshint settings
/*global window, $*/




function __modals__(main) {
    var modals = this;
    this.preferences = {};
    this.preferences.enable_smilies = $('#modals-pref-enable-smilies').prop('checked');
    this.preferences.enable_formatting = $('#modals-pref-enable-formatting').prop('checked');
    this.preferences.enable_notification_sounds = $('#modals-pref-enable-notification-sounds').prop('checked');
    this.preferences.chat_show_traffic = $('#modals-pref-chat-show-traffic').prop('checked');
    this.preferences.chat_text_size = $('#modals-pref-textsize').val();
    this.preferences.chat_text_font = $('#modals-pref-font').val();
    this.preferences.enable_tips = $('#modals-pref-enable-tips').val();

    this.updateChatBoxCallback = main.updateCheckBox;
    this.helper = new __helper__();


    $(document).ready(function() {
        modals.liveUpdateChatTextSize();
        modals.liveUpdateFont();
    });

    function submitHttpRequest(phpFile, json, successCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/' + phpFile);
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log('http request: ok. '+ xhr.responseText);
                successCallback(xhr.getResponseHeader('Content-Description'));
            } else {
                var error = xhr.getResponseHeader('Content-Description');
                console.log('http request: something went terribly wrong('+error+'), ' + xhr.status  + ':' + xhr.statusText);
            }
        };

        var formData = new FormData();
        formData.append('user_id', $('#user-id').text());
        for(var key in json) {
            formData.append(key, json[key]);
        }

        xhr.send(formData);
    }


    /*******************************************************************
    ********************************************************************
    preferences
    ********************************************************************
    *******************************************************************/

    /*
        
        @param json This json string should hold the following attributes:
                    enable_smilies,
                    enable_formatting,
                    enable_notification_sounds,
                    chat_text_size,
                    favorite_rooms,
                    chat_show_traffic
    */
    function updatePreferences(json) {
        submitHttpRequest('update-preferences.php', json);
    }

    // preferences
    $('#modal-pref-submit').click(function(_) {
        $('#modal-pref').modal('hide');
        
        var favRooms = $('#modal-pref-favorite-rooms');
        var favorite_rooms = [];
        favRooms.children().each(function(_, element) {
            favorite_rooms.push($(element).data('roomid'));
        });
        
        modals.preferences.favorite_rooms = favorite_rooms;
        updatePreferences(modals.preferences);
    });


    // Preferences listener
    $('#modals-pref-enable-smilies').change(function() {
        modals.preferences.enable_smilies = $(this).is(':checked');
        modals.updateChatBoxCallback();
    });

    $('#modals-pref-enable-formatting').change(function() {
        modals.preferences.enable_formatting = $(this).is(':checked');
        modals.updateChatBoxCallback();
    });

    $('#modals-pref-enable-notification-sounds').change(function() {
        modals.preferences.enable_notification_sounds = $(this).is(':checked');
    });

    $('#modals-pref-textsize').change(function() {
        modals.preferences.chat_text_size = $(this).val();
        modals.liveUpdateChatTextSize();
    });

    $('#modals-pref-font').change(function() {
        modals.preferences.chat_text_font = $(this).val();
        modals.liveUpdateFont();
    });

    $('#modals-pref-chat-show-traffic').change(function() {
        modals.preferences.chat_show_traffic = $(this).is(':checked');
    });

    $('#modals-pref-enable-tips').change(function() {
        modals.preferences.enable_tips = $(this).is(':checked');
    });

    this.liveUpdateFont = function() {
        var font = $('#modals-pref-font option:selected').val();
        $('body').css('font-family', font);
    };

    this.liveUpdateChatTextSize = function() {
        var fontSize = $('#modals-pref-textsize option:selected').text().replace(' ', '');
        $('#chat-entries').css('font-size', fontSize);
        
        var fontSizeInt = parseInt(fontSize, 10);
        var userWidth;
        if(fontSizeInt >= 16) {
            userWidth = 210;
        } else {
            userWidth = 150;
        }
        $('.chat-entry-user').css('width', userWidth);

        var padding = (fontSizeInt - 10);
        $('#chat .chat-entry > *').css('padding-top', padding + 'px').css('padding-bottom', padding + 'px');

        $(window).resize();
    };




    /*******************************************************************
    ********************************************************************
    profile
    ********************************************************************
    *******************************************************************/
    function updateProfile(json) {
        var json = {};
        submitHttpRequest('update-profile.php', json);
    }

    $('#modal-profile-submit').click(function(_) {
        $('#modal-profile').modal('hide');
    });


    /*******************************************************************
    ********************************************************************
    new room
    ********************************************************************
    *******************************************************************/
    function updateNewRoom(json, successCallback) {
        submitHttpRequest('update-new-room.php', json, successCallback);
    }

    $('#modal-new-room').on('shown', function() {
        $('#modals-new-room-name').focus();
    });


    $('#modal-new-room-submit').click(function(_) {
        $('#modal-new-room').modal('hide');

        var json = {};
        json.name  = $('#modals-new-room-name').val();
        json.owner = $('#user-id').text();
        json.topic = $('#modals-new-room-topic').val();

        updateNewRoom(json, function(roomId) {
            main.openRoom(roomId, json.name, json.topic);
            main.chat.sendUserJoin(roomId, json.name);
            main.chat.sendMessage("You just created the room <b>"+json.name+"</b>, congratulations!", -1, "server", roomId, json.name);
        });

    });





}