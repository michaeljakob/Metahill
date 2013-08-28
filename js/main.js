/// jshint settings
/*global window, document, $, setTimeout */

metahill.log = {};
metahill.log.roomAttendees = {};
metahill.log.unseenMessages = 0;

metahill.main = {};
metahill.main.mutedRoomIds = [];
$(function() {

    metahill.main.userName = $('#user-name > button').text().trim();
    metahill.main.userId = $('#user-id').html(); $('#user-id').remove();
    metahill.main.isGuest = $('#a45e822f21c15534a6b3dc69210751ec4').length > 0 && $('#a45e822f21c15534a6b3dc69210751ec4').remove();

    $(document).ready(function() {
        openFavoriteRooms();
        bindOnClickListeners();
    });

    /**
     * Open up all favorite rooms.
     * @return {[type]}
     */
     function openFavoriteRooms() {
        var favorites = $('#channels-list').children();
        if(favorites.length === 0) {
            metahill.main.disableInput();
            return;
        }

        var activeRoomIndex = parseInt($('#data-activeroomid').html(), 10);
        var isAnyRoomSelected = false;
        favorites.each(function(index, entry) {
            entry = $(entry);
            animateRoomAppearance(entry);

            if(index === activeRoomIndex) {
                metahill.main.selectRoom(entry);
                isAnyRoomSelected = true;
            }
        });


        if(!isAnyRoomSelected) {
            metahill.main.selectRoom(favorites[0]);
        }
    }

    /**
     * Bind various onclick listeners to (among others) log, help, submit, add-new-room and room navigation.
     * This method should only be called once.
     */
    function bindOnClickListeners() {

        var submitMessage = $('#submit-message');
        // room navigation
        $('#channels-list').children().each(function(_, entry) {
            entry = $(entry);
            entry.click(function() { metahill.main.selectRoom(entry); });
            entry.children('button').each(function(_, be) {
                $(be).click(function() { onRoomClosed(be); return false; });
            });
        });

        $('#view-log-button').click(function(e) {
            onViewChatLogClicked(e);
        });
        
        submitMessage.keydown(submitMessageProcessor);

        $('#add-new-room').click(function() {
            $('#add-new-room-rooms').children('li').each(function(_, entry) {
                $(entry).click(function() { metahill.main.onNewRoomClicked(entry); });
            });
        });



        var $latestMuteImageClicked = null;

        $('#channel-attendees-entries').on('click', 'img.kick', function() {
            var $this = $(this);
            if($latestMuteImageClicked !== null) {
                $latestMuteImageClicked.popover('destroy');
                $latestMuteImageClicked = null;
                return;
            }

            var userName = metahill.helper.getSimpleText($this.parent());

            $this.popover({ 
                trigger: 'click',
                html: true,
                placement: 'left',
                content: $('#data-kick-user-content-container').html().replace('%s', userName)
            }).popover('show');
            $('#data-kick-user-content-send').click(function() {
                $this.popover('hide');
                var duration = $('#data-kick-user-duration').val();
                $('#submit-message').val('/mute ' + userName + ' ' + duration).focus();
                // hit enter
                var e = jQuery.Event("keydown");
                e.which = 13;
                $('#submit-message').trigger(e);

            });
            $this.parent().find('.bootstrap-select').remove();
            $('.selectpicker').selectpicker();
            $latestMuteImageClicked = $this;
        });

        $('body').on('click', '.chat-entry, header, #submit-area', function(e) {
            if($latestMuteImageClicked !== null) {
                $latestMuteImageClicked.popover('destroy');
                $latestMuteImageClicked = null;
            }
        });

        $('#chat-entries-parent').on('click', '.whispered-message', function() {
            var $entry = $(this);
            var userName = $entry.children('.chat-entry-user').eq(0).text().replace(/:$/, '');
            if(userName === metahill.main.userName) {
                var $message = $entry.children('.chat-entry-message').eq(0);
                var spanText = $message.find('span').text();
                if(spanText.indexOf('whisper to ') === 0) {
                    userName = spanText.split(' ')[2];
                }
            }

            metahill.main.onWhisperClicked(userName);
        });

        $('#channel-attendees-entries').on('click', 'img.whisper', function(e) {
            var $img = $(this);
            var $button = $img.parent();

            metahill.main.onWhisperClicked(metahill.helper.getSimpleText($button));
        });

        $('#channel-attendees-entries').on('mouseenter mouseleave', 'img', function(e){
            var $img = $(this);
            switch($img.attr('class')) {
                case 'whisper':
                    if(e.type === 'mouseenter') {
                        $img.attr('src','img/icon/whisper-hover.png');
                    } else {
                        $img.attr('src','img/icon/whisper.png');
                    }
                    break;
                case 'kick':
                    if(e.type === 'mouseenter') {
                        $img.attr('src','img/icon/mute-hover.png');
                    } else {
                        $img.attr('src','img/icon/mute.png');
                    }
                    break;
                default:
                    console.log('Unknown image within `button` hovered');
            }
        });

        $(document).bind('keydown', function(event) {
            if(!event.altKey) {
                return;
            }

            var roomNum = -1;
            if(event.which >= 48 && event.which <= 57) {
                if(event.which === 48) {
                    roomNum = 10;
                } else {
                    roomNum = event.which - 48;
                }
            }
            if(roomNum !== -1) {
                event.preventDefault();
            }

            var rooms = $('#channels-list').children();
            var numRooms = rooms.length;
            if(numRooms >= roomNum) {
                var room = rooms.eq(roomNum-1);
                metahill.main.selectRoom(room);
            }
        });
    }

    metahill.main.isStatusPersistent = false;
    /*
        Make a new status message that vanishes after a certain amount of time.
        To let it be persistent, set the metahill.main.isStatusPersistent boolean to true. 
        Don't forget to afterwards set it to {@code false} again for future status messages.
        @param message Your status message
        @param alertClass The color scheme of the alert, e.g. alert-success, alert-info, alert-warning, ...
        @param duration [optional] The duration of your message. Default is 5000 ms.
    */
    metahill.main.setCurrentStatus = function(message, alertClass) {
        var duration = arguments[2] === undefined ? 5000 : arguments[2];

        var siteStatus= $('#site-status');
        // scroll old message up if necessary
        if(siteStatus.css('margin-top') !== '-50px') {
            siteStatus.animate({'margin-top': '-50px'}, 500, function() {
                metahill.main.setCurrentStatus(message, alertClass, arguments[2]);
            });
            return;
        }

        removeAlertClasses(siteStatus);
        siteStatus.addClass(alertClass);
        siteStatus.html(message);

        siteStatus.animate({'margin-top': '20px'}, 500);
        setTimeout(function() {
            if(metahill.main.isStatusPersistent) {
                return;
            }
            siteStatus.animate({'margin-top': '-50px'}, 500);
        }, duration);
    };


    metahill.main.onWhisperClicked = function(userName) {
        var $submit = $('#submit-message');
        var oldText = $submit.val();
        if(oldText.indexOf('/whisper ') === 0) {
            oldText = oldText.split(' ').splice(2).join(' ');
        }

        $submit.val('/whisper ' + userName + ' ' + oldText).focus();
    };

    metahill.main.makeAttendeeEntryText = function(userId, userName) {
        var isKickVisible = metahill.base.user.that.mayReignOver(userName);
        var isWhisperVisible = userName !== metahill.main.userName;

        return  '<li id="channel-attendees-'+ userId +'">'+
                    userName +
                    ((isWhisperVisible && !metahill.base.support.isEmbedded)?'<img alt="" title="Whisper" class="whisper" src="img/icon/whisper.png" />':'')+
                    ((isKickVisible && !metahill.base.support.isEmbedded)?'<img alt="" title="Mute" class="kick" src="img/icon/mute.png" />':'')+
                '</li>';
    };


    /**
     * Try to complete a username from the given input.
     * If there is no match, the input string is returned.
     * The function works case insensitive.
     * @param  {string} message
     * @return {string} 
     */
    var tryToCompleteUsername = (function() {
        function replaceUserName(word) {
            var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
            var userList = metahill.log.roomAttendees[roomName];

            for(var userName in userList) {
                if(userName.toLowerCase().indexOf(word.toLowerCase()) === 0) {
                    return userName;
                }
            }

            return word;
        }

        return function(message) {
            var words = message.split(' ');
            var lastWord = words.pop();
            var messageWithoutLastWord = words.join(' ');

            if(lastWord === '') 
                return message;


            if(words.length >= 1) {
                return messageWithoutLastWord + ' ' + replaceUserName(lastWord) + ' ';
            } else {
                return replaceUserName(lastWord) + ' ';
            }
        };
    })();

    /**
     * Processes all input and acts if necessary (e.g. on "ENTER" or "TAB" hit).
     * @param  {KeyboardEvent} e
     */
    var submitMessageProcessor = (function(e) {
        var INPUT_CHARACTER_LIMIT = 512; // a bit more than the actual limit (500) for ` * _
        var submitMessage = $('#submit-message');
        var latestMessages = [];
        var latestMessagesIndex = -1;
        var scrollInputValue; // if you scroll through other messages, we store the current input

        return function(e) {
            var keyCode = e.which;
            switch(keyCode) {
                // ENTER
                case 13:
                    var message = submitMessage.val().rtrim();
                    if(message.length > 0) {
                        if(message.length > INPUT_CHARACTER_LIMIT) {
                            message = message.substr(0, INPUT_CHARACTER_LIMIT);
                        }

                        if(!metahill.main.command.parse(message)) {
                            var escapedMessage = metahill.helper.htmlEncode(message);
                            var success = metahill.chat.sendMessage(escapedMessage, metahill.main.userId, metahill.main.userName, metahill.main.activeRoom.attr('data-roomid'), metahill.helper.getSimpleText(metahill.main.activeRoom));
                            if(success)
                                submitMessage.val('');
                        } else {
                            submitMessage.val('');
                        }
                        latestMessages.unshift(message);
                        latestMessagesIndex = -1;
                    }
                    break;
                // SPACE
                case 32:
                    if(metahill.main.command.tryCompletion(submitMessage.val()))
                        e.preventDefault();

                    break;
                // TAB
                case 9:
                    e.preventDefault();
                    var text = submitMessage.val();
                    if(text !== '' && !metahill.main.command.tryCompletion(text)) {


                        submitMessage.val(tryToCompleteUsername(text));
                    }
                    break;
                // UP ARROW
                case 38:
                    e.preventDefault();
                    if(latestMessagesIndex === -1) {
                        scrollInputValue = submitMessage.val();
                    }
                    if(latestMessagesIndex < latestMessages.length-1) {
                        latestMessagesIndex++;

                        submitMessage.val(latestMessages[latestMessagesIndex]);
                    }
                    break;
                // DOWN ARROW
                case 40:
                    latestMessagesIndex--;
                    if(latestMessagesIndex <= -1) {
                        submitMessage.val(scrollInputValue);
                        latestMessagesIndex = -1;
                    } else {
                        submitMessage.val(latestMessages[latestMessagesIndex]);
                    }
                    break;
                default:
            }
        };
    })();


    /**
     * Test whether the currently logged in user is addressed by this message.
     * @param  {string} message
     * @return {bool} isAddressed
     */
    var isThisUserAddressed = (function() {
        var regex = new RegExp('.*([^a-zA-Z0-9]|^)'+metahill.main.userName+'([^a-zA-Z0-9]|$).*', 'i');

        return function(message) {
            return regex.test(message);
        };
    })();

    metahill.main.addVisibleImage = function(userName, roomName, message, time) {
        metahill.main.addVisibleMessage(userName, roomName, message, time, true);
    };


    var titleBlink = (function() {
        var isUnseenMessagesTitleSet = false;
        var intervalId = null;

        function resetBlinker() {
            clearInterval(intervalId);
            intervalId = null;
            isUnseenMessagesTitleSet = false;
        }

        $(window).focus(function() {
            resetBlinker();
        });

        $('body').click(function() {
            resetBlinker();
        });

        return function(alternateTitle) {
            if(intervalId !== null)
                return;

            intervalId = setInterval(function() {
                if(isUnseenMessagesTitleSet) {
                    isUnseenMessagesTitleSet = false;
                    document.title = alternateTitle;
                } else {
                    isUnseenMessagesTitleSet = true;
                    document.title = '(' + metahill.log.unseenMessages + ') Metahill';
                }
            }, 1000);

        };
    })();

    /**
     * Add a new message, which must not necessarily come from "this" user.
     * @param  {string} userName
     * @param  {string} roomName
     * @param  {string} message
     * @param  {string} time
     */
    metahill.main.addVisibleMessage = function(userName, roomName, message, time, isImage, optionalClasses, optionalAttributes) {
        if(isImage === undefined) {
            isImage = false;
        }

        if(optionalClasses === undefined) {
            optionalClasses = '';
        }
        if(optionalAttributes === undefined) {
            optionalAttributes = '';
        }

        function highlightUser() {
            metahill.sound.playUserAddressed();
            room.addClass('btn-danger');

            titleBlink(userName + ' messaged you.');
        }

        var room = $('#channels-list').find('li:contains("'+roomName+'")');
        var roomId = room.attr('data-roomid');

        if(userName !== metahill.main.userName && userName !== '' && !metahill.base.isWindowFocused) {
            ++metahill.log.unseenMessages;
            document.title = '(' + metahill.log.unseenMessages + ') Metahill';

            if(isThisUserAddressed(message) || optionalClasses === 'whispered-message') {
                highlightUser();
            }
        }

        var chatEntries = $('#chat-entries-' + roomId);
        var entry;
        if(isImage) {
            entry = $(metahill.main.makeEntryImageText(userName, room, message, time));
        } else {
            entry = $(metahill.main.makeEntryMessageText(userName, room, message, time, optionalClasses, optionalAttributes));
        }
        var scrollDeltaToBottom = 0;
        if(chatEntries[0] !== undefined) {
            scrollDeltaToBottom = (chatEntries[0].scrollHeight - chatEntries.scrollTop()) - chatEntries.outerHeight();
        }
        chatEntries.append(entry);

        if(scrollDeltaToBottom <= 70) {
            chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 400}, 700);
        }

        if(roomName !== metahill.helper.getSimpleText(metahill.main.activeRoom) && userName !== '') {
            var unseenMessages = room.children('.unseen-messages').eq(0);
            var msgCount = unseenMessages.html() === ''? 0 : parseInt(unseenMessages.html(), 10);
            if(msgCount === 0) {
                unseenMessages.show('slow');
            }
            unseenMessages.html(msgCount + 1);

            var activeRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
            if(roomName !== activeRoomName && userName !== metahill.main.userName && isThisUserAddressed(message)) {
                highlightUser();
            }
        } else {

            metahill.modals.liveUpdateChatTextSize();

            if(typeof PR !== 'undefined') {
                PR.prettyPrint();
            }
        }
    };

    $(function() {
        var $overlay = $('#magnify-image-overlay');
        var latestUrl = null;
        $('#chat-entries-parent').on('mouseenter mouseleave', '*[data-magnifyurl]:not(.no-magnify)', function(event) {
            if(event.type === 'mouseenter') {
                latestUrl = $(this).attr('data-magnifyurl');
                $overlay.attr('src', latestUrl).show();
            } else {
                $overlay.attr('src', '').hide();
            }
        });

        $overlay.hover(function() {
            if(latestUrl !== null) {
                $overlay.attr('src', latestUrl).show();
            }
        }, function() {
            $overlay.attr('src', '').hide();
        });
    });

    metahill.main.makeImageTagFromUrl = function(url) {
        var imageId = metahill.helper.generateRandomString(5);
        var linkTag = $('<a target="_blank" href="'+url+'"></a>');
        var imageTag = $('<img alt="" id="imgup-'+imageId+'" class="image-message" data-magnifyurl="'+url+'" src="' + url + '"/>');
        linkTag.append(imageTag);


        var newImg = new Image();
        newImg.onload = function() {
            if(newImg.height < 100){
                $('#imgup-' + imageId).removeAttr('id').addClass('no-magnify');
            }
        };
        newImg.src = url;

        return linkTag[0].outerHTML;   
    };

    /**
     * Defines what happens when someone clicks the "Vie Chat Log"-button.
     */
    function onViewChatLogClicked(e) {
        var url =  'log/' + encodeURIComponent(metahill.helper.getSimpleText(metahill.main.activeRoom));
        metahill.helper.openUrlInNewTab(url);
    }

    /**
     * Reloads all room attendees for the currently active room.
     * Note that -depending on the number of attednees- this function might be slow, 
     * therefore you should avoid calling it too often.
     * @return {string}
     */
    metahill.main.updateAttendeesList = function() {
        var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(metahill.log.roomAttendees[roomName] === undefined) {
            return;
        }

        var attendeesList = $('#channel-attendees-entries');
        attendeesList.empty();

        var currentAttendees = metahill.log.roomAttendees[roomName];
        var cache = '';
        for(var userName in currentAttendees) {
            cache += metahill.main.makeAttendeeEntryText(currentAttendees[userName].id, userName);
        }
        attendeesList.append(cache);
    };

    metahill.main.selectRoom = function(newRoom) {
        if(!(newRoom instanceof jQuery)) {
            newRoom = $(newRoom);
        }
        if(newRoom.attr('id') === 'add-new-room'){
            return;
        }

        if(metahill.main.activeRoom === undefined) {
            metahill.main.activeRoom = $(document.createElement('span'));
        }

        var oldRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        var newRoomName = metahill.helper.getSimpleText(newRoom);

        if(newRoomName !== oldRoomName) {

            metahill.log.roomAttendees[newRoomName] = metahill.log.roomAttendees[newRoomName] || {};

            if(!metahill.main.isGuest) {
                metahill.helper.submitHttpRequest('update-activeroom.php', { userId: metahill.main.userId, activeRoom: newRoom.index()});
            }
            $('#chat-entries-' + metahill.main.activeRoom.attr('data-roomid')).hide();
            removeButtonClasses(metahill.main.activeRoom);
            removeButtonClasses(newRoom);
            newRoom.addClass('btn-primary');
            

            if(newRoom.attr('data-owner') === metahill.main.userId) {
                if($('#room-settings').length === 0) {
                    var code = '<button class="btn" id="room-settings" alt="Room Settings" title="Room Settings" href="#modal-room-pref" data-toggle="modal">'+
                                    '<img alt="" src="img/icon/room_settings.png"/>Room Settings'+
                                '</button>';
                    $('#view-log-button').after(code);
                }
            } else {
                $('#room-settings').remove();
            }
            
            metahill.main.activeRoom = newRoom;
            metahill.main.enableInput();
            if(metahill.main.mutedRoomIds.indexOf(newRoom.attr('data-roomid')) !== -1) {
                $('#submit-message').prop('disabled', true).blur();
            }
            
            metahill.main.updateAttendeesList();
            $('#chat-header-topic').html(metahill.formatMessages.styleMessage(metahill.helper.htmlEncode(newRoom.attr('data-topic'))));

            // reset "unseen message" counter
            var unseenMessages = newRoom.children('.unseen-messages');
            unseenMessages.hide(metahill.base.support.isAnimated && 'slow');
            unseenMessages.html('0');

            // set scrollbars accordingly
            $(window).resize();

            var activeRoomId = metahill.main.activeRoom.attr('data-roomid');
            var newChatEntries = $('#chat-entries-' + activeRoomId);
            newChatEntries.show();

            if(newChatEntries[0] !== undefined)
                newChatEntries.scrollTop(newChatEntries[0].scrollHeight);
        }
    };

    function removeButtonClasses(obj) {
        obj.removeClass('btn-warning btn-danger btn-primary btn-info btn-primary');
    }

    function removeAlertClasses(obj) {
        obj.removeClass('alert-warning alert-error alert-info alert-success');
    }


    metahill.main.getRoomFromName = function(roomName) {
        return $('#channels-list').find('li:contains("'+roomName+'")');
    };

    metahill.main.closeRoom = (function() {
        var MIN_QUIT_DELAY = 400;
        var timeLastRoomClosed = 0;

        return function(roomName) {
            var now = new Date().getTime();
            if(now - timeLastRoomClosed < MIN_QUIT_DELAY) {
                return;
            }
            timeLastRoomClosed = now;
            var $button = metahill.main.getRoomFromName(roomName).find('button');
            onRoomClosed($button);
        };

    })();

    function onRoomClosed(closeButton) {
        var room = $(closeButton).parent();
        var roomId = room.attr('data-roomid');
        var roomName = metahill.helper.getSimpleText(room);
        var roomTopic = room.attr('data-topic');
        var roomOwner = room.attr('data-owner');

        $('#add-new-room').popover('hide');

        if(!metahill.main.isGuest) {
            metahill.helper.submitHttpRequest('remove-favorite.php', 
                {   
                    position: room.index()+1, 
                    userId: metahill.main.userId, 
                    roomId: roomId 
                });
        }

        if(metahill.base.support.isAnimated) {
            room.css('maxHeight', room.height());
            room.animate({'width': '0', 'padding-left': '0', 'padding-right':'0'}, 200, 'swing', function() { room.remove(); });
        } else {
            room.remove();
        }

        var wasActiveRoomClosed = metahill.helper.getSimpleText(room) === metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(wasActiveRoomClosed || room.parent().children().length <= 1) {
            metahill.main.disableInput();
        } else {
            metahill.main.enableInput();
        }
        $('#chat-entries-' + roomId).remove();

        // make it available to be added
        addAvailableRoom(roomId, roomName, roomTopic, roomOwner);

        // announce
        metahill.chat.sendUserQuit(roomId, roomName);
        delete metahill.log.roomAttendees[roomName];

        // select another room
        if(wasActiveRoomClosed) {
            var newActiveRoom = room.next();
            if(newActiveRoom.length === 0){
                newActiveRoom = room.prev();
            }
            if(newActiveRoom.length !== 0) {
                metahill.main.selectRoom(newActiveRoom);
            } else {
                $('#channel-attendees-entries').empty();
            }
        }
    }

    metahill.main.onNewRoomClicked = function(obj) {
        metahill.main.enableInput();

        // get basic info
        var roomInList = $(obj);
        var roomName = roomInList.text();
        var roomId = roomInList.attr('data-roomid');
        var roomTopic = roomInList.attr('data-topic');
        var roomOwner = roomInList.attr('data-owner');

        if(!metahill.main.isGuest) {
            metahill.helper.submitHttpRequest('add-favorite.php', 
                { 
                    userId: metahill.main.userId, 
                    roomId: roomId,
                    position: $('#channels-list').children().length + 1
                });
        }


        if(metahill.main.activeRoom !== undefined) {
            metahill.main.activeRoom.removeClass('btn-primary');
            $('#chat-entries-' + metahill.main.activeRoom.attr('data-roomid')).hide();
        }

        $('#chat-header-topic').html(metahill.formatMessages.styleMessage(roomTopic));

        var entryAndWidth = metahill.main.openRoom(roomId, roomName, roomTopic, roomOwner);
        var entry = entryAndWidth.entry;
        // animate popover
        var addNewRoom = $('#add-new-room');
        var popover = addNewRoom.next();
        var popoverLeft = parseInt(popover.css('left'), 10);
        var newRoomWidth = entryAndWidth.width;
        var newLeft;
        if(popoverLeft !== 0) {
            newLeft = popoverLeft + newRoomWidth + 2; // 2 px margin between rooms
        } else {
            // don't let it drop negative
            newLeft = Math.max(0, addNewRoom.position().left + newRoomWidth - 128 + 2);
        }
        popover.animate({'left': newLeft}, 200);

        // animate removed entry
        roomInList.animate({'height': 0, 'padding-top':0, 'padding-bottom':0}, 200, function() {
            roomInList.remove();
            // remove them in the popover too
            $('#add-new-room-popover > div:nth-child(2) ul > li:contains("' + roomName + '")').remove();
        });

        metahill.main.activeRoom = entry;
        metahill.main.selectRoom(entry);
        
        if(typeof PR !== 'undefined') {
            PR.prettyPrint();
        }
    };

    function animateRoomAppearance(entry) {
        console.log('anim:', entry);
        var paddingLeft = entry.css('padding-left');
        var width = entry.width();

        entry.css('maxHeight', entry.height())
        .width(0)
        .css('padding-left', 0)
        .css('padding-right', 0)
        .show()
        .animate({'width': width, 'padding-left': paddingLeft, 'padding-right': paddingLeft}, 250, function() {
            entry.removeAttr('style');
        });
    }


    /*
        Open a new room within a new tab.
        @return The <li> entry created for this room
    */
    metahill.main.openRoom = function(id, name, topic, owner) {
        // is that room already open? This can happen only due to private chats
        var isRoomAlreadyOpen = false;
        $('#channels-list').children().each(function(i, e) { 
            var n = metahill.helper.getSimpleText($(e));
            if(n === name) {
                isRoomAlreadyOpen = true;
                return;
            }
        });

        if(isRoomAlreadyOpen) {
            return;
        }

        metahill.chat.sendUserJoin(id, name);

        var entry = $('<li class="btn btn-primary"/>');
        entry.attr('data-roomid', id)
        .attr('data-topic', topic)
        .attr('data-owner', owner)
        .text(name)
        .click(function() { metahill.main.selectRoom(entry); });


        var closeButton = $('<button class="close room-close">&times;</button>');
        closeButton.click(function () { onRoomClosed(closeButton[0]); return false; });
        var unseenMessages = $(document.createElement('span')).addClass('unseen-messages');
        entry
        .append(closeButton)
        .append(unseenMessages);
        $('#channels-list').append(entry);

        var entryWidth = entry.width() + parseInt(entry.css('padding-left'), 10) * 2 + parseInt(entry.css('margin-left'), 10) * 2;
        if(metahill.base.support.isAnimated) {
            animateRoomAppearance(entry);
        }
        return { entry: entry, width: entryWidth };
    };

    /*
        Add a room to the list of all available, joinable rooms. 
        If you add a room, it will be displayed within the list after you click the '+' to add a room. 
    */
    function addAvailableRoom(roomId, roomName, roomTopic, roomOwner) {
        var root = $('#add-new-room-rooms');
        root.find('p').remove();

        var entry = $(document.createElement('li'))
        .addClass('ui-bootstrap-list-item btn room-favorite')
        .attr('data-roomid', roomId)
        .attr('data-topic', roomTopic)
        .attr('data-owner', roomOwner)
        .text(roomName);

        entry.click(function() { metahill.main.onNewRoomClicked(entry[0]); });
        root.prepend(entry);
    }

    /* 
        Enable input boxe(s) for chatting.
    */
    metahill.main.enableInput = function () {
        if(!metahill.chat.isOnline || metahill.main.activeRoom === undefined) {
            return;
        }
        var isActiveRoomUnmuted = metahill.main.mutedRoomIds.indexOf(metahill.main.activeRoom.attr('data-roomid')) === -1;
        
        var submitMessage = $('#submit-message');
        var chatEntries = $('#chat-entries');

        chatEntries.removeAttr('disabled');

        if(isActiveRoomUnmuted) {
            submitMessage.removeAttr('disabled');
        }

        if(!metahill.base.support.isMobile && !metahill.base.support.isEmbedded && isActiveRoomUnmuted) {
            submitMessage.focus();
        }

        $('#view-log-button').show();
        $('#room-settings').show();
    };

    metahill.main.disableInput = function() {
        var submitMessage = $('#submit-message');

        submitMessage.prop('disabled', true).blur();

        $('#chat-header-topic').text('');
        $('#view-log-button').hide();
        $('#room-settings').hide();
    };


    /**
     * Show a status message slowly floating in from the bottom.
     * Use this status message only if your text is firmly tied to the input/output of messages.
     * For all other status messages, use metahill.main.setCurrentStatus().
     * @param  {[type]} heading [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    metahill.main.setSubmitStatus = function(heading, message) {
        var submitStatus = $('#submit-status');
        if(parseInt(submitStatus.css('marginTop'), 10) === 120) {
            submitStatus
            .removeClass()
            .empty()
            .addClass('alert alert-error')
            .append('<h1>'+heading+'</h1>')
            .append(message)
            .animate({'margin-top': '40px'}, 500);

            setTimeout(function(){
                submitStatus.animate({'margin-top': '120px'}, 500);
            }, 5000);
        }
    };

    /************************************************************************
        Entry makers
    ************************************************************************/
    metahill.main.makeEntryMessageText = function(userName, room, message, time, optionalClasses, optionalAttributes) {
        message = metahill.formatMessages.styleMessage(message);
        return makeEntryText(userName, room, message, time, optionalClasses, optionalAttributes);
    };

    metahill.main.makeEntryImageText = function(userName, room, message, time, optionalClasses, optionalAttributes) {
        // message isn't styled up
        return makeEntryText(userName, room, metahill.main.makeImageTagFromUrl(message), time, optionalClasses, optionalAttributes);
    };

    function makeEntryText(userName, room, message, time, optionalClasses, optionalAttributes) {
        var classes = '';
        if(optionalAttributes === undefined) {
            optionalAttributes = '';
        }
        if((typeof optionalClasses) === 'string') {
            classes += optionalClasses + ' ';
        }

        if(userName === '') {
            classes += 'message-role-server';
        } else if(metahill.base.user.isAdmin(userName)) {
            classes += 'message-role-admin ';
        } else if(metahill.base.user.isMod(userName)) {
            classes += 'message-role-mod ';
        } else if($('#channel-attendees-'+room.attr('data-owner')).text() === metahill.main.userId) {
            classes += 'message-role-room-owner ';
        }

        if(userName === metahill.main.userName) {
            userName = '<b>' + userName + '</b>:';
        } else if(userName !== '') {
            userName += ':';
        } else {
            // userName is ''
            userName = '&nbsp;';
            message = '<i>' + message + '</i>';
        }

        if(optionalClasses !== undefined && optionalClasses.indexOf('whispered-message') !== -1) {
            var match = /data-to="(.*?)"/.exec(optionalAttributes);
            if(match !== null) {
                message = '<span class="label">whisper to '+match[1]+'</span>' + message;        
            } else {
                message = '<span class="label">whisper</span>' + message;        
            }
        }

        // bold username
        // var messageParts = message.split(' ');
        // var lowerCaseUserName = metahill.main.userName.toLowerCase();
        // for(var i=0; i<messageParts.length; ++i) {
        //     if(messageParts[i].toLowerCase() === lowerCaseUserName) {
        //         messageParts[i] = '<b>' + messageParts[i] + '</b>';
        //     }
        // }
        // message = messageParts.join(' ');

        var entryText =
                '<div '+optionalAttributes+' class="chat-entry '+ classes +'">' +
                    '<span class="chat-entry-options">'+metahill.helper.toHHMMSS(time)+'&nbsp;</span>' +
                    '<span class="chat-entry-user">'+userName+'</span>' +
                    '<span class="chat-entry-message">'+message+'</span>' +
                '</div>';

        return entryText;
    }

    metahill.main.unmuteRoomId = function(roomId, mutedTimeLeft) {
        setTimeout(function() {
            var roomName = metahill.helper.getSimpleText($('#channels-list').children("li[data-roomid='"+roomId+"']"));
            metahill.main.mutedRoomIds.remove(metahill.main.mutedRoomIds.indexOf(roomId));   
            metahill.main.addVisibleMessage('', roomName, 'You have been unmuted right now :)', new Date());
            if(roomId === metahill.main.activeRoom.attr('data-roomid')) {
                $('#submit-message').removeAttr('disabled').focus();
            }
        }, mutedTimeLeft);
    };




    metahill.main.addSystemMessage = function(message) {
        var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        message = '<span class="label">system</span>' + message;
        metahill.main.addVisibleMessage('', roomName, message, new Date());
    };



});