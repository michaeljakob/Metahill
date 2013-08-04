/// jshint settings
/*global window, document, $, setTimeout */

metahill.log = {};
metahill.log.roomAttendees = {};
metahill.log.unseenMessages = 0;


metahill.main = {};
$(function() {

    metahill.main.userName = $('#user-name > button').text().trim();
    metahill.main.userId = $('#user-id').html();
    metahill.main.isGuest = $('#is-guest').length > 0;

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
                $(be).click(function() { onRoomClosed(be); return false; });
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
        var attr = '';

        var content =    '<li id="channel-attendees-'+ userId +'"' + attr + '>'+
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
        var userList = metahill.log.roomAttendees[roomName];

        var lastWord = message.split(' ').pop();
        var messageWithoutLastWord = message.replace(/\w+$/,'');

        if(lastWord === '') {
            return messageWithoutLastWord;
        }

        var BreakException = {};
        try {
            var lcText = lastWord.toLowerCase();
            for(var userName in userList) {
                var lcUsername = userName.toLowerCase();
                if(lcUsername.indexOf(lcText) === 0) {
                    lastWord = userName + ' ';
                    throw BreakException;
                }
            }
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
                    if(metahill.main.isSubmitAllowed(message)) {
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

    metahill.main.addVisibleImage = function(userName, roomName, message, time) {
        metahill.main.addVisibleMessage(userName, roomName, message, time, true);
    };

    /**
     * Add a new message, which must not necessarily come from "this" user.
     * @param  {string} userName
     * @param  {string} roomName
     * @param  {string} message
     * @param  {string} time
     */
    metahill.main.addVisibleMessage = function(userName, roomName, message, time, isImage) {
        if(isImage === undefined) {
            isImage = false;
        }

        function highlightUser() {
            metahill.sound.playUserAddressed();
            room.addClass('btn-danger');
        }

        var room = $('#channels-list').find('li:contains("'+roomName+'")');
        var roomId = room.attr('data-roomid');

        if(userName !== metahill.main.userName && userName !== '' && !metahill.base.isWindowFocused) {
            ++metahill.log.unseenMessages;
            document.title = 'Metahill | ' + metahill.log.unseenMessages + ' unread messages.';

            if(isThisUserAddressed(message)) {
                highlightUser();
            }
        }

        var chatEntries = $('#chat-entries-' + roomId);
        var entry;
        if(isImage) {
            entry = $(metahill.main.makeEntryImageText(userName, room, message, time));
        } else {
            entry = $(metahill.main.makeEntryMessageText(userName, room, message, time));
        }
        var isScrolledToBottom = chatEntries[0].scrollHeight - chatEntries.scrollTop() === chatEntries.outerHeight();
        chatEntries.append(entry);

        // We only scroll down if it's already scrolled to bottom
        if(isScrolledToBottom) {
            // we assume that a message is max "400px" high (image or small browser window)
            chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 400}, 500);
        }

        if(roomName !== metahill.helper.getSimpleText(metahill.main.activeRoom) && userName !== '') {
            var unseenMessages = room.children('.unseen-messages');
            var msgCount = parseInt(unseenMessages.text(), 10);
            if(msgCount === 0) {
                unseenMessages.show('slow');
            }
            unseenMessages.text(msgCount + 1);
            var activeRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
            if(roomName !== activeRoomName && isThisUserAddressed(message)) {
                highlightUser();
            }
        } else {

            metahill.modals.liveUpdateChatTextSize();

            if(PR !== undefined) {
                PR.prettyPrint();
            }
        }
    };

    metahill.main.getMagnifyOnHoverCode = function(url) {
        var hoverIn = '$(\'#magnify-image-overlay\').attr(\'src\', \''+url+'\').show();';
        var hoverOut = '$(\'#magnify-image-overlay\').hide();';

        return 'onmouseover="'+hoverIn+'" onmouseout="'+hoverOut+'"';        
    };

    metahill.main.makeImageTagFromUrl = function(url) {
        return '<a target="_blank" href="'+url+'"><img class="image-message" '+ metahill.main.getMagnifyOnHoverCode(url) +' src="' + url + '"/></a>';   
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
            cache += metahill.main.makeAttendeeEntry(currentAttendees[userName].id, userName);
        }
        attendeesList.append(cache);
    };

    ;
    function onRoomSelected(newRoom) {
        newRoom = $(newRoom);
        if(newRoom.attr('id') === 'add-new-room'){
            return;
        }

        if(metahill.main.activeRoom === undefined) {
            metahill.main.activeRoom = $(document.createElement('span'));
        }

        var oldRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        var newRoomName = metahill.helper.getSimpleText(newRoom);

        if(newRoomName !== oldRoomName) {
            console.log(oldRoomName + "<>" + newRoomName);
            metahill.main.enableInput();
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
                                    '<img src="img/icon/room_settings.png"/>Room Settings'+
                                '</button>';
                    $('#view-log-button').after(code);
                }
            } else {
                $('#room-settings').remove();
            }
            
            metahill.main.activeRoom = newRoom;
            
            metahill.main.updateAttendeesList();
            $('#chat-header-topic').html(metahill.formatMessages.makeLinksClickable(metahill.helper.htmlEncode(newRoom.attr('data-topic'))));


            // reset "unseen message" counter
            var unseenMessages = newRoom.children('.unseen-messages');
            unseenMessages.hide(metahill.base.support.isAnimated && 'slow');
            unseenMessages.text('0');



            // set scrollbars accordingly
            $(window).resize();

            var activeRoomId = metahill.main.activeRoom.attr('data-roomid');
            var newChatEntries = $('#chat-entries-' + activeRoomId);
            newChatEntries.show();

            if(newChatEntries[0] !== undefined)
                newChatEntries.scrollTop(newChatEntries[0].scrollHeight);
        }
    }

    function removeButtonClasses(obj) {
        obj.removeClass('btn-warning btn-danger btn-primary btn-info btn-success');
    }

    function removeAlertClasses(obj) {
        obj.removeClass('alert-warning alert-error alert-info alert-success');
    }

    function onRoomClosed(obj) {
        var room = $(obj).parent();
        var roomId = room.attr('data-roomid');
        var roomName = metahill.helper.getSimpleText(room);
        var roomTopic = room.attr('data-topic');
        var roomOwner = room.attr('data-owner');

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

        var newActiveRoom = room.next();
        console.log(newActiveRoom);
        if(newActiveRoom.length === 0){
            newActiveRoom = room.prev();
        }
        if(newActiveRoom.length !== 0) {
            onRoomSelected(newActiveRoom);
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

        metahill.chat.sendUserJoin(roomId, roomName);

        if(metahill.main.activeRoom !== undefined) {
            metahill.main.activeRoom.removeClass('btn-primary');
            $('#chat-entries-' + metahill.main.activeRoom.attr('data-roomid')).hide();
        }

        $('#chat-header-topic').html(metahill.formatMessages.makeLinksClickable(roomTopic));

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

        entry.css('maxHeight', entry.height())
        .width(0)
        .css('padding-left', 0)
        .css('padding-right', 0)
        .show()
        .animate({'width': width, 'padding-left': paddingLeft, 'padding-right': paddingLeft}, 200, function() {
            entry.removeAttr('style');
        });
    }


    /*
        Open a new room within a new tab.
        @return The <li> entry created for this room
    */
    metahill.main.openRoom = function(id, name, topic, owner) {
        var entry = $('<li class="btn btn-primary"/>');
        entry.attr('data-roomid', id)
        .attr('data-topic', topic)
        .attr('data-owner', owner)
        .text(name)
        .click(function() { onRoomSelected(entry); });
        var closeButton = $('<button class="close room-close">&times;</button>');
        var unseenMessages = $('<span class="unseen-messages"/>');
        closeButton.click(function () { onRoomClosed(closeButton[0]); return false; });
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
        if(!metahill.chat.isOnline) {
            return;
        }
        
        var submitMessage = $('#submit-message');
        var chatEntries = $('#chat-entries');

        chatEntries.removeAttr('disabled');
        submitMessage.removeAttr('disabled');

        if(!metahill.base.support.isMobile && !metahill.base.support.isEmbedded) {
            submitMessage.focus();
        }

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
    metahill.main.isSubmitAllowed = (function(){
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
                    metahill.main.setSubmitStatus('Man, calm down!','Your mission is not to spam the room. :P');
                    return false;
                }
            }
            return true;
        };
    })();

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
    metahill.main.makeEntryMessageText = function(userName, room, message, time, optionalClasses) {
        message = metahill.formatMessages.styleMessage(message);
        return makeEntryText(userName, room, message, time, optionalClasses);
    };

    metahill.main.makeEntryImageText = function(userName, room, message, time, optionalClasses) {
        // message isn't styled up
        return makeEntryText(userName, room, metahill.main.makeImageTagFromUrl(message), time, optionalClasses);
    };

    function makeEntryText(userName, room, message, time, optionalClasses) {
        var classes = '';
        if((typeof optionalClasses) === 'string') {
            classes += optionalClasses + ' ';
        }
        var adminNames = ['Michael'];
        var modNames = ['Weexe', 'Dodovogel'];

        var roleSymbol = '';
        if(userName === '') {
            roleSymbol = '✧';
        } else if(adminNames.indexOf(userName) !== -1) {
            roleSymbol = '&#10037;';
        } else if(modNames.indexOf(userName) !== -1) {
            roleSymbol = '&#10036;';
        } else if(userName === $('#channel-attendees-' + room.attr('data-owner')).text()) {
            roleSymbol = '&#10035;';
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

        var entryText =
                '<div class="chat-entry '+ classes +'">' +
                    '<span class="chat-entry-options">'+metahill.helper.toHHMMSS(time)+'</span>' +
                    '<span class="chat-entry-user"><span class="rank-symbol">'+roleSymbol+'</span>'+userName+'</span>' +
                    '<span class="chat-entry-message">'+message+'</span>' +
                '</div>';

        return entryText;
    }

});