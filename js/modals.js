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
    this.preferences.user_id = $('#user-id').html();

    this.updateChatBoxCallback = main.updateCheckBox;


    $(document).ready(function() {
        modals.liveUpdateChatTextSize();
        modals.liveUpdateFont();

        $('#modals-profile-current-password-info, #modals-room-pref-current-password-info').popover({
            trigger: 'hover',
            placement: 'left',
            title: 'Why do I need to confirm my password?',
            content: 'Security. It is all about confidential information which we try to keep as secure as possible.'
        });
    });



    /*******************************************************************
    ********************************************************************
    (user) preferences
    ********************************************************************
    *******************************************************************/
    function updatePreferences(json) {
        main.helper.submitHttpRequest('update-preferences.php', json);
    }

    // preferences
    $('#modal-pref-submit').click(function(_) {
        $('#modal-pref').modal('hide');
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
        $('body *').css('font-family', font);
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
    function updateProfile(json, successCallback) {
        main.helper.submitHttpRequest('update-profile.php', json, successCallback);
    }

    $('#modal-profile').on('shown', function() {
        $('#modals-profile-current-password').focus(); 
    });

    $('#modals-profile-current-password').bind('propertychange keyup input paste', function() {
        var len = $(this).val().length;
        if(len >= 8 && len <= 20) {
            $('#modal-profile-submit').removeAttr('disabled');
        } else {
            $('#modal-profile-submit').prop('disabled', true);
        }
    });

    $('#modal-profile-submit').click(function(_) {
        var deleteCheckBox = $('#modals-profile-delete');
        if(deleteCheckBox.is(':checked')) {
            var isDeletionConfirmed = confirm('If you confirm now, your account will be permanently removed and you will not be able to log in with this user again. Do you still want to confirm the account deletion?');
            if(isDeletionConfirmed) {
                $('#modal-profile').modal('hide');

                var json = {};
                json.intent = 'delete-account';
                json.userId = $('#user-id').html();
                json.currentPassword = $('#modals-profile-current-password');
                updateProfile(json);
                document.location.href = 'why-account-deletion.php';
            } else {
                deleteCheckBox.prop('checked', false); 
            }
        } else {
            $('#modal-profile').modal('hide');

            var currentPassInput = $('#modals-profile-current-password');
            var newPassInput = $('#modals-profile-new-password');

            var json = {};
            json.intent = 'change-password';
            json.userId = $('#user-id').html();
            json.currentPassword = currentPassInput.val();
            json.newPassword = newPassInput.val();

            currentPassInput.val('');
            newPassInput.val('');

            updateProfile(json, function(r) {
                var result = r.split('>');
                var intent = result[0];
                var resultCode = parseInt(result[1], 10);
                switch(intent) {
                    case 'delete-account':
                        break;
                    case 'change-password':
                        if(parseInt(resultCode, 10) === 1) {
                            main.setCurrentStatus('Password changed successfully.', 'alert-success');
                        } else {
                            main.setCurrentStatus('Sorry man, I couldn\'t verify that password.', 'alert-warning');
                        }
                        break;
                    default:
                        console.log('unknown intent returned');
                }
            });
        }
    });

    /*******************************************************************
    ********************************************************************
    new room
    ********************************************************************
    *******************************************************************/
    function updateNewRoom(json, successCallback) {
        main.helper.submitHttpRequest('update-new-room.php', json, successCallback);
    }

    $('#modal-new-room').on('show', function() {
        $('#add-new-room').popover('hide');
    });

    $('#modal-new-room').on('shown', function() {
        $('#modals-new-room-name').focus();
    });


    this.new_room = {};
    this.new_room.isNameAvailable = false;
    this.new_room.isNameLengthOk = false;
    this.new_room.isTopicLengthOk = false;

    this.verifyNewRoomInput = function() {
        if(modals.new_room.isNameLengthOk && modals.new_room.isTopicLengthOk && modals.new_room.isNameAvailable) {
            $('#modal-new-room-submit').removeAttr('disabled');
        } else {
            $('#modal-new-room-submit').prop('disabled', true);
        }
    };
    $('#modals-new-room-name').bind('propertychange keyup input paste', function() {
        var roomName = $(this).val().trim();
        var len = roomName.length;
        modals.new_room.isNameLengthOk = len >= 3 && len <= 20;

        if(modals.new_room.isNameLengthOk) {
            var json = {};
            json.roomname = roomName;
            main.helper.submitHttpRequest('does-roomname-exist.php', json, function(resultCode) {
                if(parseInt(resultCode, 10) === 1) {
                    // already exists
                    modals.new_room.isNameAvailable = false;
                    $('#modals-new-room-name-status').show();
                } else {
                    modals.new_room.isNameAvailable = true;
                    $('#modals-new-room-name-status').hide();
                }
                modals.verifyNewRoomInput();
            });
        }
        modals.verifyNewRoomInput();
    });
    $('#modals-new-room-topic').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        modals.new_room.isTopicLengthOk = len >= 20 && len <= 200;        

        modals.verifyNewRoomInput();
    });


    $('#modal-new-room-submit').click(function(_) {
        $('#modal-new-room').modal('hide');

        var json = {};
        json.name  = $('#modals-new-room-name').val().trim();
        json.owner = $('#user-id').text();
        json.topic = $('#modals-new-room-topic').val().trim();


        updateNewRoom(json, function(roomId) {
            $('#modals-new-room-name').val('');
            $('#modals-new-room-topic').val('');

            main.openRoom(roomId, json.name, json.topic);
            main.chat.sendUserJoin(roomId, json.name);
            main.chat.sendMessage('You just created the room <b>'+json.name+'</b>, congratulations!', -1, 'server', roomId, json.name);
            
            (function(userId, roomId) {
                var message = {};
                message.userId = userId;
                message.roomId = roomId;
                main.helper.submitHttpRequest('add-favorite.php', message);
            })(json.owner, roomId);
        });

    });


    /*******************************************************************
    ********************************************************************
    room preferences
    ********************************************************************
    *******************************************************************/
    function updateRoomPreferences(json, successCallback) {
        main.helper.submitHttpRequest('update-room-pref.php', json, successCallback);
    }

    this.room_pref = {};
    this.room_pref.isRoomNameToTitleAdded = false;
    this.room_pref.isPasswordLengthOk = false;
    this.room_pref.isTopicLengthOk = false;
    this.room_pref.currentTopic = '';

    $('#modal-room-pref').on('show', function() {
        if(!modals.room_pref.isRoomNameToTitleAdded) {
            modals.room_pref.isRoomNameToTitleAdded = true;
            var title =$('#modal-room-pref h3:first');
            title.html('<u>' + main.helper.getSimpleText(main._activeRoom) + '</u>' + title.html());
        }

        modals.room_pref.currentTopic = main._activeRoom.data('topic');
        $('#modals-room-pref-topic')
        .val(modals.room_pref.currentTopic)
        .keyup();
    });

    $('#modal-room-pref').on('shown', function() {
        var textarea = $('#modals-room-pref-topic');
        textarea
        .focus()
        .val('')
        .val(main._activeRoom.data('topic'));
    });

    $('#modal-room-pref-submit').click(function() {
        //$('#modal-room-pref').modal('hide');

        var currentPasswordBox = $('#modals-room-pref-current-password');
        var submitButton = $(this);

        var json = {};
        json.roomTopic = $('#modals-room-pref-topic').val().trim();
        json.roomId = main._activeRoom.data('roomid');
        json.userId = $('#user-id').html();
        json.userPassword = currentPasswordBox.val();

        if(json.roomTopic === modals.room_pref.currentTopic) {
            $('#modal-room-pref').modal('hide');
            currentPasswordBox.val('');
            return;
        }

        updateRoomPreferences(json, function(returnCode) {
            currentPasswordBox.val('');
            if(parseInt(returnCode, 10) >= 1) {
                main._activeRoom.data('topic', json.roomTopic);
                $('#chat-header-topic').html(main.formatMessages.makeLinksClickable(json.roomTopic));
                $('#modal-room-pref').modal('hide');
            } else {
                currentPasswordBox.attr('placeholder', 'Wrong pass :(');
                currentPasswordBox.focus();
                submitButton.prop('disabled', true);
            }
        });

    });

    $('#modals-room-pref-current-password').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        modals.room_pref.isPasswordLengthOk = len >= 8 && len <= 30;
        verifyRoomPreferencesInput();
    });

    $('#modals-room-pref-topic').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        modals.room_pref.isTopicLengthOk = len >= 20 && len <= 200;        
        verifyRoomPreferencesInput();
    });

    function verifyRoomPreferencesInput() { 
        var topicOkay = modals.room_pref.isTopicLengthOk;
        if($('#modals-room-pref-delete').is(':checked')) {
            topicOkay = true;
        }

        if(modals.room_pref.isPasswordLengthOk && topicOkay) {
            $('#modal-room-pref-submit').removeAttr('disabled');
        } else {
            $('#modal-room-pref-submit').prop('disabled', true);
        }
    }
}