/// jshint settings
/*global window, $*/


metahill.modals = {};

var popoverInModalHelper = false;
$(document).ready(function() {
    metahill.modals.preferences = {};
    metahill.modals.preferences.enable_smilies = $('#modals-pref-enable-smilies').prop('checked');
    metahill.modals.preferences.enable_formatting = $('#modals-pref-enable-formatting').prop('checked');
    metahill.modals.preferences.enable_notification_sounds = $('#modals-pref-enable-notification-sounds').prop('checked');
    metahill.modals.preferences.chat_show_traffic = $('#modals-pref-chat-show-traffic').prop('checked');
    metahill.modals.preferences.chat_text_size = $('#modals-pref-textsize').val();
    metahill.modals.preferences.chat_text_font = $('#modals-pref-font').val();
    metahill.modals.preferences.enable_tips = $('#modals-pref-enable-tips').prop('checked');
    metahill.modals.preferences.user_id = metahill.main.userId;


    $('#modals-profile-current-password-info, #modals-room-pref-current-password-info').popover({
        trigger: 'manual',
        placement: 'left',
        title: 'Why do you want my password?',
        content: 'Security. It is all about confidential information which we try to keep as secure as possible.'
    }).hover(function() {
        popoverInModalHelper = true;
        $(this).popover('show');
    }, function() {
        popoverInModalHelper = false;
        $(this).popover('hide');
    });
});


metahill.modals.liveUpdateFont = function() {
    var font = $('#modals-pref-font option:selected').val();
    $('#phpcss').empty().append('body,body *{font-family: ' + font + ';}');
};

metahill.modals.liveUpdateChatTextSize = function() {
    var fontSize = $('#modals-pref-textsize option:selected').text().replace(' ', '');
    
    var fontSizeInt = parseInt(fontSize, 10);
    var userWidth;
    var smileyHeight = 11;
    if(fontSizeInt >= 21) {
        userWidth = 370;
    } else if(fontSizeInt >= 18) {
        userWidth = 270;
    } else if(fontSizeInt >= 14) {
        userWidth = 210;
        smileyHeight = 16;
    } else if(fontSizeInt >= 12){
        userWidth = 150;
        smileyHeight = 15;
    }
    var css =   '.chat-entry-user { width: '+userWidth+'px !important;}' +
                '#chat-entries-parent { font-size:'+fontSize+' !important;}' +
                '#chat .chat-entry > .chat-entry-message { margin-left:'+(userWidth+65)+'px !important;}'+
                '#chat .chat-entry > .chat-entry-message > img[src^="img/smilies"]{height: '+smileyHeight+'px !important;}';
    $('#live-update-chat-text-size').empty().append(css);

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
    });

    $('#modals-pref-enable-formatting').change(function() {
        metahill.modals.preferences.enable_formatting = $(this).is(':checked');
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
    verificaton.isNameValid = false;
    verificaton.isTopicLengthOk = false;
    verificaton.isPasswordLengthOk = true;

    function verifyNewRoomInput() {
        if(verificaton.isNameLengthOk && verificaton.isTopicLengthOk && verificaton.isNameAvailable && verificaton.isNameValid && verificaton.isPasswordLengthOk) {
            $('#modal-new-room-submit').removeAttr('disabled');
        } else {
            $('#modal-new-room-submit').prop('disabled', true);
        }

        if(verificaton.isNameValid) {
            $('#modals-new-room-name-status').hide();
        } else {
            $('#modals-new-room-name-status').html('Only use alphanumeric symbols or -, _, #').show();
        }
    }

    $('#modals-new-room-name').bind('propertychange keyup input paste', function() {
        var roomName = metahill.helper.htmlEncode($(this).val().trim());
        var len = roomName.length;
        verificaton.isNameLengthOk = len >= 3 && len <= 20;
        verificaton.isNameValid = /^[a-zA-Z0-9\-_#]{3,20}$/.test(roomName); 

        if(verificaton.isNameLengthOk) {
            var json = {};
            json.roomname = roomName;
            metahill.helper.submitHttpRequest('does-roomname-exist.php', json, function(resultCode) {
                if(parseInt(resultCode, 10) === 1) {
                    // already exists
                    verificaton.isNameAvailable = false;
                    $('#modals-new-room-name-status').html('This room already exists.').show();
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

    $('#modals-new-room-password').bind('propertychange keyup input paste', function() {
        verificaton.isPasswordLengthOk = $(this).val().trim().length <= 64;
        if(!verificaton.isPasswordLengthOk) {
            $('#modals-new-room-password-status').show();
        } else {
            $('#modals-new-room-password-status').hide();
        }
        verifyNewRoomInput();
    });

    $('#modals-new-room-private').change(function() {
        if($(this).prop('checked')) {
            $('#modals-new-room-password-animator').show('fast');
            $('#modals-new-room-password').focus();
        } else {
            $('#modals-new-room-password-animator').hide('fast');
        }
    });


    $('#modal-new-room-submit').click(function(_) {
        $('#modal-new-room').modal('hide');

        var json = {};
        json.name  = $('#modals-new-room-name').val().trim();
        json.owner = metahill.main.userId;
        json.topic = $('#modals-new-room-topic').val().trim();
        json.password = $('#modals-new-room-password').val();

        updateNewRoom(json, function(roomId) {
            $('#modals-new-room-name').val('');
            $('#modals-new-room-topic').val('');
            $('#modals-new-room-password').val('');
            $('#modals-new-room-password-parent').hide();
            $('#modals-new-room-private').prop('checked', false);


            var isRoomPrivate = json.password !== '';
            var entry = metahill.main.openRoom(roomId, json.name, json.topic, metahill.main.userId, isRoomPrivate).entry;
            metahill.main.selectRoom(entry);
            metahill.chat.sendUserJoin(roomId, json.name);
            metahill.main.addVisibleMessage('', json.name, 'You just created the room <b>'+json.name+'</b>, congratulations!', new Date());
            
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
    verificaton.originalTitle = '';
    verificaton.originalAdmins = '';

    $('#modal-room-pref')
    .on('show', function() {
        if(popoverInModalHelper) {
            return;
        }
        if(!verificaton.isRoomNameToTitleAdded) {
            verificaton.isRoomNameToTitleAdded = true;
            var title = $('#modal-room-pref h3:first');
            title.html('"' + metahill.helper.getSimpleText(metahill.main.activeRoom) +'"' + title.html());
        }

        verificaton.originalTitle = metahill.helper.htmlEncode(metahill.main.activeRoom.attr('data-topic'));
        $('#modals-room-pref-topic').val(metahill.main.activeRoom.attr('data-topic'));
        $('#modals-room-pref-topic').keyup();

        var isPrivateRoom = metahill.main.activeRoom.attr('data-is-private') === '1';
        if(!isPrivateRoom) {
            $('#modals-room-pref-room-password').hide().prev().hide().prev().hide();
        } else {
            $('#modals-room-pref-room-password').show().prev().show().prev().show();
        }

        var roomId = metahill.main.activeRoom.attr('data-roomid');
        // load room admins
        var urlGetRoomAdmins = 'dev/rest/get-room-admins.php';
        metahill.helper.submitHttpRequestGeneral(urlGetRoomAdmins, {roomId: roomId, includeOwner: false}, function(text) {
            if(text !== 'null') {
                verificaton.originalAdmins = text;
                var names = text.replace(/,/g, ', ');
                $('#modals-room-pref-admins').val(names);
            }
        });

        if(metahill.base.user.that.ownedRooms.indexOf(parseInt(roomId,10)) !== -1) {
            if($('#modals-room-pref-admins-box').length === 0) {
                $('#modals-room-pref-topic').after(metahill.html.getSettingsOwnerMenu());
            }
        } else {
            $('#modals-room-pref-admins-box').remove();
        }

    })
    .on('hidden', function() {
        $('#submit-message').focus();
    });

    $('#modal-room-pref').on('shown', function() {
        // set cursor to the end
        var topicBox = $('#modals-room-pref-topic');
        var topic = topicBox.val();
        topicBox.val('').focus().val(topic);

        $('#modals-room-pref-current-password').attr('placeholder', 'Your current password');
    });

    $('#modal-room-pref-submit').click(function() {
        if($(this).is(':disabled'))
            return;
        
        var currentPasswordBox = $('#modals-room-pref-current-password');
        var submitButton = $(this);

        var json = {};
        json.roomTopic = metahill.helper.htmlEncode($('#modals-room-pref-topic').val().trim());
        json.roomId = metahill.main.activeRoom.attr('data-roomid');
        json.roomNewPassword = $('#modals-room-pref-room-password').val();
        json.roomAdmins = $('#modals-room-pref-admins').val().replace(/ /g, '');
        json.userId = metahill.main.userId;
        json.userName = metahill.main.userName;
        json.userPassword = currentPasswordBox.val();

        if(json.roomNewPassword === '') {
            json.roomNewPassword = null;
        }

        updateRoomPreferences(json, function(returnCode) {
            currentPasswordBox.val('');
            switch(returnCode) {
                case '0': // wrong pass
                    currentPasswordBox.attr('placeholder', 'Wrong pass :(');
                    currentPasswordBox.focus();
                    break;
                case '1': // success
                    metahill.main.activeRoom.attr('data-topic', json.roomTopic);
                    $('#chat-header-topic').html(metahill.formatMessages.styleMessage(json.roomTopic));
                    $('#modal-room-pref').modal('hide');
                    currentPasswordBox.attr('placeholder', 'Your current password');
                    break;
                default: // unknown room admin given
                    $('#modal-room-pref').modal('hide');
                    currentPasswordBox.attr('placeholder', 'Your current password');
                    metahill.main.setCurrentStatus('Unknown room-admin "'+returnCode+'"');
            }
            submitButton.prop('disabled', true);
        });

    });

    $('#modals-room-pref-current-password').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        verificaton.isPasswordLengthOk = len >= 8 && len <= 30;
        verifyRoomPreferencesInput();
    });

    $('#modals-room-pref-current-password').keyup(function(event){
        if(event.keyCode == 13){
            $('#modal-room-pref-submit').click();
        }
    });

    $('#modals-room-pref-topic').bind('propertychange keyup input paste', function() {
        var len = $(this).val().trim().length;
        verificaton.isTopicLengthOk = len >= 20 && len <= 400;        
        verifyRoomPreferencesInput();
    });

    function verifyRoomPreferencesInput() {
        if(verificaton.isPasswordLengthOk && verificaton.isTopicLengthOk) {
            $('#modal-room-pref-submit').removeAttr('disabled');
        } else {
            $('#modal-room-pref-submit').prop('disabled', true);
        }
    }
});

// modal-verify-room-password
$(function() {
    
    var $password = $('#modal-verify-room-password-value');
    var $submit = $('#modal-verify-room-password-submit');
    $password.bind('propertychange keyup input paste', function() {
        if($password.val().length >= 1) {
            $submit.removeAttr('disabled');
        } else {
            $submit.prop('disabled', true);
        }

    }).keyup(function(event){
        if(event.keyCode == 13){
            $submit.click();
        }
    });

    $('#modal-verify-room-password').on('show', function() {
        $submit.prop('disabled', true);
    });

    $('#modal-verify-room-password').on('shown', function() {
        $password.focus();
    }).on('hidden', function() {
        $('#submit-message').focus();
        $password.val('');
    });

});

$(function() {
    $('#modal-info-submit').click(function() {
        $('#modal-info').modal('hide');
    });

    metahill.modals.showInfo = function(title, message) {
        $('#modal-info-title').html(title);
        $('#modal-info-message').html(message);
        $('#modal-info').modal('show');
    };

    metahill.modals.dismissInfo = function() {
        $('#modal-info').modal('hide');
    };
});



