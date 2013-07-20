/// jshint settings
/*global window, $*/


metahill.modals = {};


$(document).ready(function() {
    metahill.modals.preferences = {};
    metahill.modals.preferences.enable_smilies = $('#modals-pref-enable-smilies').prop('checked');
    metahill.modals.preferences.enable_formatting = $('#modals-pref-enable-formatting').prop('checked');
    metahill.modals.preferences.enable_notification_sounds = $('#modals-pref-enable-notification-sounds').prop('checked');
    metahill.modals.preferences.chat_show_traffic = $('#modals-pref-chat-show-traffic').prop('checked');
    metahill.modals.preferences.chat_text_size = $('#modals-pref-textsize').val();
    metahill.modals.preferences.chat_text_font = $('#modals-pref-font').val();
    metahill.modals.preferences.enable_tips = $('#modals-pref-enable-tips').val();
    metahill.modals.preferences.user_id = metahill.main.userId;

    metahill.modals.liveUpdateChatTextSize();

    $('#modals-profile-current-password-info, #modals-room-pref-current-password-info').popover({
        trigger: 'hover',
        placement: 'left',
        title: 'Why do you want my password?',
        content: 'Security. It is all about confidential information which we try to keep as secure as possible.'
    });
});


metahill.modals.liveUpdateFont = function() {
    var font = $('#modals-pref-font option:selected').val();
    $('#phpcss').empty().append('body,body *{font-family: ' + font + ';}');
};

metahill.modals.liveUpdateChatTextSize = function() {
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
    $('#chat .chat-entry').children().css('padding-top', padding + 'px').css('padding-bottom', padding + 'px');

    $(window).resize();
};


/**
 * Preferences
 * @return {[type]} [description]
 */
$(function() {
    function updatePreferences(json) {
        metahill.helper.submitHttpRequest('update-preferences.php', json);
    }

    // preferences
    $('#modal-pref-submit').click(function() {
        $('#modal-pref').modal('hide');
        updatePreferences(metahill.modals.preferences);
    });

    $('#modal-pref').on('hidden', function() {
        $('#submit-message').focus();
    });


    // Preferences listener
    $('#modals-pref-enable-smilies').change(function() {
        metahill.modals.preferences.enable_smilies = $(this).is(':checked');
        metahill.main.updateChatBox();
    });

    $('#modals-pref-enable-formatting').change(function() {
        metahill.modals.preferences.enable_formatting = $(this).is(':checked');
        metahill.main.updateChatBox();
    });

    $('#modals-pref-enable-notification-sounds').change(function() {
        metahill.modals.preferences.enable_notification_sounds = $(this).is(':checked');
    });

    $('#modals-pref-textsize').change(function() {
        metahill.modals.preferences.chat_text_size = $(this).val();
        metahill.modals.liveUpdateChatTextSize();
    });

    $('#modals-pref-font').change(function() {
        metahill.modals.preferences.chat_text_font = $(this).val();
        metahill.modals.liveUpdateFont();
    });

    $('#modals-pref-chat-show-traffic').change(function() {
        metahill.modals.preferences.chat_show_traffic = $(this).is(':checked');
    });

    $('#modals-pref-enable-tips').change(function() {
        metahill.modals.preferences.enable_tips = $(this).is(':checked');
    });
}); // end preferences


/**
 * Profile
 * @return {[type]} [description]
 */
$(function() {
    var submitButton = $('#modal-profile-submit');

    function updateProfile(json, successCallback) {
        metahill.helper.submitHttpRequest('update-profile.php', json, successCallback);
    }

    $('#modal-profile').on('shown', function() {
        $('#modals-profile-current-password').focus(); 
    });

    $('#modal-profile').on('hidden', function() {
        $('#submit-message').focus();
    });

    $('#modals-profile-current-password').bind('propertychange keyup input paste', function() {
        var len = $(this).val().length;
        if(len >= 8 && len <= 20) {
            submitButton.removeAttr('disabled');
        } else {
            submitButton.prop('disabled', true);
        }
    });

    submitButton.click(function(_) {
        var deleteCheckBox = $('#modals-profile-delete');
        var json = {};
        if(deleteCheckBox.is(':checked')) {
            var isDeletionConfirmed = confirm('If you confirm now, your account will be permanently removed and you will not be able to log in with this user again. Do you still want to confirm the account deletion?');
            if(isDeletionConfirmed) {
                $('#modal-profile').modal('hide');
                

                json.intent = 'delete-account';
                json.userId = metahill.main.userId;
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

            json.intent = 'change-password';
            json.userId = metahill.main.userId;
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
                            metahill.main.setCurrentStatus('Password changed successfully.', 'alert-success');
                        } else {
                            metahill.main.setCurrentStatus('Sorry man, I couldn\'t verify that password.', 'alert-warning');
                        }
                        break;
                    default:
                        console.log('unknown intent returned');
                }
            });
        }
    });
}); // end profile


/**
 * New Room
 * @return {[type]} [description]
 */
$(function() {
    function updateNewRoom(json, successCallback) {
        metahill.helper.submitHttpRequest('update-new-room.php', json, successCallback);
    }
    $('#modal-new-room')
    .on('show', function() {
        $('#add-new-room').popover('hide');
    })
    .on('shown', function() {
        $('#modals-new-room-name').focus();
    })
    .on('hidden', function() {
        $('#submit-message').focus();
    });

    var verificaton = {};
    verificaton.isNameAvailable = false;
    verificaton.isNameLengthOk = false;
    verificaton.isTopicLengthOk = false;

    function verifyNewRoomInput() {
        if(verificaton.isNameLengthOk && verificaton.isTopicLengthOk && verificaton.isNameAvailable) {
            $('#modal-new-room-submit').removeAttr('disabled');
        } else {
            $('#modal-new-room-submit').prop('disabled', true);
        }
    }

    $('#modals-new-room-name').bind('propertychange keyup input paste', function() {
        var roomName = metahill.helper.htmlEncode($(this).val().trim());
        var len = roomName.length;
        verificaton.isNameLengthOk = len >= 3 && len <= 20;

        if(verificaton.isNameLengthOk) {
            var json = {};
            json.roomname = roomName;
            metahill.helper.submitHttpRequest('does-roomname-exist.php', json, function(resultCode) {
                if(parseInt(resultCode, 10) === 1) {
                    // already exists
                    verificaton.isNameAvailable = false;
                    $('#modals-new-room-name-status').show();
                } else {
                    verificaton.isNameAvailable = true;
                    $('#modals-new-room-name-status').hide();
                }
                verifyNewRoomInput();
            });
        }
        verifyNewRoomInput();
    });
    $('#modals-new-room-topic').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        verificaton.isTopicLengthOk = len >= 20 && len <= 400;        

        verifyNewRoomInput();
    });


    $('#modal-new-room-submit').click(function(_) {
        $('#modal-new-room').modal('hide');
        

        var json = {};
        json.name  = $('#modals-new-room-name').val().trim();
        json.owner = metahill.main.userId;
        json.topic = ($('#modals-new-room-topic').val().trim());
        // not wrapped in htmlEncode. For the db, we do it below. For the UI, openRoom will do it for us


        updateNewRoom(json, function(roomId) {
            $('#modals-new-room-name').val('');
            $('#modals-new-room-topic').val('');

            metahill.main.openRoom(roomId, json.name, metahill.helper.htmlEncode(json.topic), metahill.main.userId);
            metahill.chat.sendUserJoin(roomId, json.name);
            metahill.chat.sendMessage('You just created the room <b>'+json.name+'</b>, congratulations!', -1, 'server', roomId, json.name);
            
            (function(userId, roomId) {
                var message = {};
                message.userId = userId;
                message.roomId = roomId;
                message.position = $('#channels-list').children().length + 1;
                metahill.helper.submitHttpRequest('add-favorite.php', message);
            })(json.owner, roomId);
        });

    });
}); // end new room


/**
 * Room Preferences
 * @return {[type]} [description]
 */
$(function() {

    function updateRoomPreferences(json, successCallback) {
        metahill.helper.submitHttpRequest('update-room-pref.php', json, successCallback);
    }

    var verificaton = {};
    verificaton.isRoomNameToTitleAdded = false;
    verificaton.isPasswordLengthOk = false;
    verificaton.isTopicLengthOk = false;
    verificaton.currentTopic = '';

    $('#modal-room-pref')
    .on('show', function() {
        if(!verificaton.isRoomNameToTitleAdded) {
            verificaton.isRoomNameToTitleAdded = true;
            var title =$('#modal-room-pref h3:first');
            title.html('"' + metahill.helper.getSimpleText(metahill.main.activeRoom) +'"' + title.html());
        }

        verificaton.currentTopic = metahill.helper.htmlDecode(metahill.main.activeRoom.attr('data-topic'));
        $('#modals-room-pref-topic').val(metahill.main.activeRoom.attr('data-topic'));
    })
    .on('hidden', function() {
        $('#submit-message').focus();
    });

    $('#modal-room-pref').on('shown', function() {
        // set cursor to the end
        var topicBox = $('#modals-room-pref-topic');
        var topic = topicBox.val();
        topicBox.val('').focus().val(topic);
    });

    $('#modal-room-pref-submit').click(function() {
        var currentPasswordBox = $('#modals-room-pref-current-password');
        var submitButton = $(this);

        var json = {};
        json.roomTopic = metahill.helper.htmlEncode($('#modals-room-pref-topic').val().trim());
        json.roomId = metahill.main.activeRoom.attr('data-roomid');
        json.userId = metahill.main.userId;
        json.userPassword = currentPasswordBox.val();

        if(json.roomTopic === verificaton.currentTopic) {
            $('#modal-room-pref').modal('hide');
            
            currentPasswordBox.val('');
            return;
        }

        updateRoomPreferences(json, function(returnCode) {
            currentPasswordBox.val('');
            if(parseInt(returnCode, 10) >= 1) {
                metahill.main.activeRoom.attr('data-topic', json.roomTopic);
                $('#chat-header-topic').html(metahill.formatMessages.makeLinksClickable(json.roomTopic));
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
        verificaton.isPasswordLengthOk = len >= 8 && len <= 30;
        verifyRoomPreferencesInput();
    });

    $('#modals-room-pref-topic').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        verificaton.isTopicLengthOk = len >= 20 && len <= 400;        
        verifyRoomPreferencesInput();
    });

    function verifyRoomPreferencesInput() { 
        var topicOkay = verificaton.isTopicLengthOk;
        if($('#modals-room-pref-delete').is(':checked')) {
            topicOkay = true;
        }

        if(verificaton.isPasswordLengthOk && topicOkay) {
            $('#modal-room-pref-submit').removeAttr('disabled');
        } else {
            $('#modal-room-pref-submit').prop('disabled', true);
        }
    }
});





