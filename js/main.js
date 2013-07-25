/// jshint settings
/*global window, document, $, setTimeout */

metahill.log = {};
metahill.log.messages = {};
metahill.log.users = {};
metahill.log.times = {};
metahill.log.roomAttendees = {};


metahill.main = {};
$(function() {

    metahill.main.userName = $('#user-name > button').text().trim();
    metahill.main.userId = $('#user-id').html();


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
        var activeRoomIndex = parseInt($('#data-activeroomid').html(),10);
        var isAnyRoomSelected = false;
        favorites.each(function(index, entry) {
            entry = $(entry);
            var closeButton = entry.find('button > .room-close');
            closeButton.click(function() { onRoomClosed(closeButton); });

            animateRoomAppearance(entry);
            if(index === activeRoomIndex) {
                onRoomSelected(entry);
                isAnyRoomSelected = true;
            }
        });


        if(!isAnyRoomSelected) {
            onRoomSelected(favorites[0]);
        }
    }

    /**
     * Bind various onclick listeners to (among others) log, help, submit, add-new-room and room navigation.
     * This method should only be called once.
     */
    function bindOnClickListeners() {
        // room navigation
        $('#channels-list').children().each(function(_, entry) {
            entry = $(entry);
            entry.click(function() { onRoomSelected(entry); });
            entry.children('button').each(function(_, be) {
                $(be).click(function() { onRoomClosed(be); });
            });
        });

        $('#view-log-button').click(function(e) {
            onViewChatLogClicked(e);
        });
        
        $('#submit-message').keydown(messageProcessor);

        $('#add-new-room').click(function() {
            $('#add-new-room-rooms').children('li').each(function(_, entry) {
                $(entry).click(function() { metahill.main.onNewRoomClicked(entry); });
            });
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


    metahill.main.makeAttendeeEntry = function(userId, userName) {
        var content =    '<li id="channel-attendees-'+ userId +'">'+
                            '<button disabled class="btn">'+ userName +'</button>'+
                        '</li>';

        return content;
    };


    /**
     * Try to complete a username from the given input.
     * If there is no match, the input string is returned.
     * The function works case insensitive.
     * @param  {string} message
     * @return {string} 
     */
    function tryToCompleteUsername(message) {
        var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        var userNames = metahill.log.roomAttendees[roomName];

        var lastWord = message.split(' ').pop();
        var messageWithoutLastWord = message.replace(/\w+$/,'');

        if(lastWord === '') {
            return messageWithoutLastWord;
        }

        var BreakException = {};
        try {
            var lcText = lastWord.toLowerCase();
            userNames.forEach(function(entry) {
                var lcUsername = entry.userName.toLowerCase();
                if(lcUsername.indexOf(lcText) === 0) {
                    lastWord = entry.userName + ' ';
                    throw BreakException;
                }
            });
        } catch(e) {
            if(e !== BreakException) {
                throw e;
            }
        }

        return messageWithoutLastWord + lastWord;
    }

    /**
     * Processes all input and acts if necessary (e.g. on "ENTER" or "TAB" hit).
     * @param  {KeyboardEvent} e
     */
    var messageProcessor = (function(e) {
        var INPUT_CHARACTER_LIMIT = 500;
        var submitMessage = $('#submit-message');
        var lastMessages = [];
        var lastMessagesIndex = -1;
        var scrollInputValue; // if you scroll through other messages, we store the current input

        return function(e) {
            var keyCode = e.which;
            switch(keyCode) {
                // ENTER
                case 13:
                    var message = metahill.helper.htmlEncode(submitMessage.val()).trim();
                    if(isSubmitAllowed(message)) {
                        if(message.length > 0) {
                            if(message.length > INPUT_CHARACTER_LIMIT) {
                                message = message.substr(0, INPUT_CHARACTER_LIMIT);
                            }
                            metahill.chat.sendMessage(message, metahill.main.userId, metahill.main.userName, metahill.main.activeRoom.attr('data-roomid'), metahill.helper.getSimpleText(metahill.main.activeRoom));
                            submitMessage.val('');
                            lastMessages.unshift(message);
                            lastMessagesIndex = -1;
                        }
                    }
                    break;
                // TAB
                case 9:
                    var text = submitMessage.val();
                    if(text !== '') {
                        e.preventDefault();
                        submitMessage.val(tryToCompleteUsername(text));
                    }
                    break;
                // UP ARROW
                case 38:
                    if(lastMessagesIndex === -1) {
                        scrollInputValue = submitMessage.val();
                    }
                    if(lastMessagesIndex < lastMessages.length-1) {
                        lastMessagesIndex++;

                        submitMessage.val(lastMessages[lastMessagesIndex]);
                    }
                    break;
                // DOWN ARROW
                case 40:
                    lastMessagesIndex--;
                    if(lastMessagesIndex <= -1) {
                        submitMessage.val(scrollInputValue);
                        lastMessagesIndex = -1;
                    } else {
                        submitMessage.val(lastMessages[lastMessagesIndex]);
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
        var regex = new RegExp('.*[\\s:;.,|<>]?'+metahill.main.userName+'[\\s:;.,!|<>]?.*', '');

        return function(message) {
            return regex.test(message);
        };
    })();

    metahill.main.logChatMessage = function(roomName, userName, message, time) {
        if(metahill.log.messages[roomName] === undefined)
            metahill.log.messages[roomName] = [];
        if(metahill.log.users[roomName] === undefined)
            metahill.log.users[roomName] = [];
        if(metahill.log.times[roomName] === undefined)
            metahill.log.times[roomName] = [];

        metahill.log.messages[roomName].push(message);
        metahill.log.users[roomName].push(userName);
        metahill.log.times[roomName].push(time);
    };


    /**
     * Add a new message, which must not necessarily come from "this" user.
     * @param  {string} userName
     * @param  {string} roomName
     * @param  {string} message
     * @param  {string} time
     */
    metahill.main.addVisibleMessage = function(userName, roomName, message, time) {
        var room;
        function highlightUser() {
            metahill.sound.playUserAddressed();
            $.titleAlert('Someone talked to you!');

            room = room || $('#channels-list').find('li:contains("'+roomName+'")');
            room.removeClass('room-favorite').addClass('btn-danger');
        }
        metahill.main.logChatMessage(roomName, userName, message, time);

        var activeRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(userName !== metahill.main.userName && userName !== '' && isThisUserAddressed(message)) {
            if(!metahill.base.isWindowFocused || roomName !== activeRoomName) {
                highlightUser();
            }
        }

        if(roomName !== metahill.helper.getSimpleText(metahill.main.activeRoom) && userName !== '') {
            room = room || $('#channels-list').find('li:contains("'+roomName+'")');
            var unseenMessages = room.children('.unseen-messages');
            var msgCount = parseInt(unseenMessages.text(), 10);
            if(msgCount === 0) {
                unseenMessages.show('slow');
            }
            unseenMessages.text(msgCount + 1);
        } else {
            var entry;
            if(arguments[4] === true) {
                entry = $(metahill.main.makeEntryImageText(userName, message, time));
            } else {
                entry = $(metahill.main.makeEntryMessageText(userName, message, time));
            }
            var chatEntries = $('#chat-entries');
            var isScrolledToBottom = chatEntries[0].scrollHeight - chatEntries.scrollTop() === chatEntries.outerHeight();
            chatEntries.append(entry);

            // We only scroll down if it's already scrolled to bottom
            if(isScrolledToBottom) {
                // we assume that a message is max "700px" high (image or small browser window)
                chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 700}, 500);
            }

            var children = entry.children();
            var maxHeight = $(children[2]).height();
            $(children[0]).height(maxHeight);
            $(children[1]).height(maxHeight);


            metahill.modals.liveUpdateChatTextSize();
        }
    };

    metahill.main.makeImageTagFromUrl = function(url) {
        var tag = '<span class="image-tooltip">' +
                    '<img src="' + url + '"></img>' +
                    '<span><img src="' + url + '"></img></span>' +
                  '</span>';
        return tag;
    };

    metahill.main.addVisibleImage = function(userName, roomName, url, time) {
        var tag = metahill.main.makeImageTagFromUrl(url);
        metahill.main.addVisibleMessage(userName, roomName, tag, time, true);
    };

    /**
     * Reloads all chat messages for the currently active room.
     * Note that -depending on the number of messages- this function might be slow, 
     * therefore you should avoid calling it too often.
     * @return {string}
     */
    metahill.main.updateChatBox = function() {
        var chatEntries = $('#chat-entries');
        chatEntries.empty();

        var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(metahill.log.messages[roomName] === undefined) {
            return;
        }

        var len = metahill.log.messages[roomName].length;
        var cache = '';
        var classes = 'logged-message';
        for(var i=0; i<len; ++i) {
            if(classes !== null && i >= 10) {
                classes = null;
            }
            var userName = metahill.log.users[roomName][i];
            cache += metahill.main.makeEntryMessageText(userName, metahill.log.messages[roomName][i], metahill.log.times[roomName][i], classes);
        }
        chatEntries.append(cache);
        metahill.modals.liveUpdateChatTextSize();
        $(window).resize();
        chatEntries.scrollTop(chatEntries.height());
    };

    /**
     * Defines what happens when someone clicks the "Vie Chat Log"-button.
     */
    function onViewChatLogClicked(e) {
        var url =  'log/' + encodeURIComponent(metahill.helper.getSimpleText(metahill.main.activeRoom));
        if(e.shiftKey) {
            metahill.helper.openUrlInNewTab(url);
        } else {
            document.location = url;
        }
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
        var cache = "";
        for(var i=0; i<currentAttendees.length; ++i) {
            var entry = currentAttendees[i];
            cache += metahill.main.makeAttendeeEntry(entry.userId, entry.userName);
        }
        attendeesList.append(cache);
    };

    var _closeRoomWasClicked = false;
    function onRoomSelected(newRoom) {
        if(_closeRoomWasClicked) {
            _closeRoomWasClicked = false;
            return;
        }

        if(metahill.main.activeRoom === undefined) {
            metahill.main.activeRoom = $(document.createElement('span'));
        }

        newRoom = $(newRoom);
        if(newRoom.attr('id') === 'add-new-room'){
            return;
        }

        metahill.main.enableInput();

        var oldRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        var newRoomName = metahill.helper.getSimpleText(newRoom);
        if(metahill.log.roomAttendees[newRoomName] === undefined) {
            metahill.log.roomAttendees[newRoomName] = [];
        }

        if(newRoomName !== oldRoomName) {
            metahill.helper.submitHttpRequest('update-activeroom.php', { userId: metahill.main.userId, activeRoom: newRoom.index()});
            removeButtonClasses(metahill.main.activeRoom);
            removeButtonClasses(newRoom);
            newRoom.addClass('btn-primary');
            metahill.main.activeRoom.addClass('room-favorite');
            

            metahill.main.activeRoom = newRoom;
            metahill.main.updateChatBox();
            metahill.main.updateAttendeesList();
            $('#chat-entries').scrollTop(100000000);
            $('#chat-header-topic').html(metahill.formatMessages.makeLinksClickable(metahill.helper.htmlEncode(newRoom.attr('data-topic'))));

            if(newRoom.attr('data-owner') === metahill.main.userId) {
                if($('#room-settings').length === 0) {
                    var code = '<button class="btn" id="room-settings" alt="Room Settings" title="Room Settings" href="#modal-room-pref" data-toggle="modal">'+
                                    '<img src="img/icon/room_settings.png"/>Room Settings'+
                                '</button>';
                    $('#view-log-button').after(code);
                }
            } else {
                $('#room-settings').remove();
            }
            

            // reset "unseen message" counter
            var unseenMessages = newRoom.children('.unseen-messages');
            unseenMessages.hide(metahill.base.support.isAnimated && 'slow');
            unseenMessages.text('0');
        }
    }

    function removeButtonClasses(obj) {
        obj.removeClass('btn-warning btn-danger btn-primary btn-info btn-success');
    }

    function removeAlertClasses(obj) {
        obj.removeClass('alert-warning alert-error alert-info alert-success');
    }

    function onRoomClosed(obj) {
        _closeRoomWasClicked = true;

        var room = $(obj).parent();
        var roomId = room.attr('data-roomid');
        var roomName = metahill.helper.getSimpleText(room);
        var roomTopic = room.attr('data-topic');
        var roomOwner = room.attr('data-owner');

        metahill.helper.submitHttpRequest('remove-favorite.php', 
            {   
                position: room.index()+1, 
                userId: metahill.main.userId, 
                roomId: roomId 
            });

        if(metahill.base.support.isAnimated) {
            room.css('maxHeight', room.height());
            room.animate({'width': '0', 'padding-left': '0', 'padding-right':'0'}, 200, 'swing', function() {room.remove();});
        } else {
            room.remove();
        }

        var wasActiveRoomClosed = metahill.helper.getSimpleText(room) === metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(room.parent().children().length <= 1 || wasActiveRoomClosed) {
            metahill.main.disableInput();
        } else {
            metahill.main.enableInput();
        }

        // make it available to be added
        addAvailableRoom(roomId, roomName, roomTopic, roomOwner);

        // announce
        metahill.chat.sendUserQuit(roomId, roomName);
        delete metahill.log.roomAttendees[roomName];
    }

    metahill.main.onNewRoomClicked = function(obj) {
        metahill.main.enableInput();

        // get basic info
        var roomInList = $(obj);
        var roomName = roomInList.text();
        var roomId = roomInList.attr('data-roomid');
        var roomTopic = roomInList.attr('data-topic');
        var roomOwner = roomInList.attr('data-owner');

        metahill.helper.submitHttpRequest('add-favorite.php', 
            { 
                userId: metahill.main.userId, 
                roomId: roomId,
                position: $('#channels-list').children().length + 1
            });

        metahill.chat.sendUserJoin(roomId, roomName);

        if(metahill.main.activeRoom !== undefined) {
            metahill.main.activeRoom.removeClass('btn-primary');
        }

        $('#chat-header-topic').html(metahill.formatMessages.makeLinksClickable(roomTopic));
        $('#chat-entries').empty();

        var entry = metahill.main.openRoom(roomId, roomName, roomTopic, roomOwner);
        
        // animate popover
        var popover = $('#add-new-room').next();
        var popoverLeft = parseInt(popover.css('left'), 10);
        var width = entry.width();
        var paddingLeft = entry.css('padding-left');
        var newRoomWidth = width + 2 * parseInt(paddingLeft, 10) + 6; // width, padding, margin
        var newLeft = popoverLeft + newRoomWidth;
        popover.animate({'left': newLeft}, 200);

        if(metahill.base.support.isAnimated) {
            animateRoomAppearance(entry);
        }

        // animate removed entry
        roomInList.animate({'height': 0, 'padding-top':0, 'padding-bottom':0}, 200, function() {
            roomInList.remove();
            // remove them in the popover too
            $('#add-new-room-popover > div:nth-child(2) ul > li:contains("' + roomName + '")').remove();
        });

        metahill.main.activeRoom = entry;
    };

    function animateRoomAppearance(entry) {
        var paddingLeft = entry.css('padding-left');
        var width = entry.width();

        entry.css('maxHeight', entry.height());
        entry.width(0);
        entry.css('padding-left', 0);
        entry.css('padding-right', 0);
        entry.show();
        entry.animate({'width': width, 'padding-left': paddingLeft, 'padding-right': paddingLeft}, 200, function() {
            entry.removeAttr('style');
        });
    }


    /*
        Open a new room within a new tab.
        @return The <li> entry created for this room
    */
    metahill.main.openRoom = function(id, name, topic, owner) {
        var entry = $('<li class="btn btn-primary room-favorite"/>');
        entry.attr('data-roomid', id);
        entry.attr('data-topic', topic);
        entry.attr('data-owner', owner);
        entry.text(name);

        entry.click(function() { onRoomSelected(entry); });
        var closeButton = $('<button class="close room-close">&times;</button>');
        var unseenMessages = $('<span class="unseen-messages"></span>');
        closeButton.click(function () { onRoomClosed(closeButton[0]); });
        entry
        .append(closeButton)
        .append(unseenMessages);
        $('#channels-list').append(entry);
        onRoomSelected(entry);

        return entry;
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
        var submitMessage = $('#submit-message');
        var chatEntries = $('#chat-entries');

        chatEntries.removeAttr('disabled');
        submitMessage.removeAttr('disabled');
        submitMessage.focus();

        $('#view-log-button').show();
        $('#room-settings').show();
    };

    metahill.main.disableInput = function() {
        var submitMessage = $('#submit-message');
        var chatEntries = $('#chat-entries');

        chatEntries.attr('disabled', 'disabled');
        submitMessage.attr('disabled', 'disabled');
        submitMessage.blur();

        $('#chat-header-topic').text('');
        $('#view-log-button').hide();
        $('#room-settings').hide();
    };


    /**
     * Checks wheter we allow or disallow the to submit the message
     * @return {bool} isAllowed
     */
    var isSubmitAllowed = (function(){
        var MESSAGE_LIMIT = 3;
        var TIME_SPAN = 3000;
        var submissionTimes = [];

        return function(message) {
            if(message.trim().length === 0) {
                return;
            }

            submissionTimes.push(new Date().getTime());
            if(submissionTimes.length > MESSAGE_LIMIT) {
                submissionTimes.shift();
                
                if(submissionTimes[MESSAGE_LIMIT-1] - submissionTimes[0] > TIME_SPAN) {
                    return true;
                } else {
                    var submitStatus = $('#submit-status');
                    if(parseInt(submitStatus.css('marginTop'), 10) === 120) {
                        submitStatus
                        .removeClass()
                        .empty()
                        .addClass('alert alert-error')
                        .append('<h1>Man, calm down!</h1>')
                        .append('Your mission is not to spam the room. :P')
                        .animate({'margin-top': '40px'}, 500);

                        setTimeout(function(){
                            submitStatus.animate({'margin-top': '120px'}, 500);
                        }, 5000);
                    }

                    return false;
                }
            }
            return true;
        };
    })();

    /************************************************************************
        Entry makers
    ************************************************************************/
    metahill.main.makeEntryMessageText = function(userName, message, time, optionalClasses) {
        message = metahill.formatMessages.styleMessage(message);
        return makeEntryText(userName, message, time, optionalClasses);
    };

    metahill.main.makeEntryImageText = function(userName, message, time, optionalClasses) {
        // message isn't styled up
        return makeEntryText(userName, message, time, optionalClasses);
    };


    function makeEntryText(userName, message, time, optionalClasses) {
        var classes = '';
        if((typeof optionalClasses) === 'string') {
            classes += optionalClasses + ' ';
        }
        var adminNames = ['server'];
        if(adminNames.indexOf(userName) !== -1) {
            classes += 'server-message ';
        }
        if(userName === metahill.main.userName) {
            userName = '<b>' + userName + '</b>';
        }

        var entryText =
                '<div class="chat-entry '+ classes +'">' +
                    '<span class="chat-entry-options">'+metahill.helper.toHHMMSS(time)+'</span>' +
                    '<span class="chat-entry-user ">'+userName+'</span>' +
                    '<span class="chat-entry-message">'+message+
                '</div>';


        return entryText;
    }

});