/// jshint settings
/*global window, document, $, setTimeout, __format_messages__, __helper__, __sound__, __status__, __chat__, __image_upload__ */

$(function() {
    var main = this;

    this._activeRoom;
    this._userName;
    this.modals = new __modals__(this);
    this.sstatus = new __status__();
    this.chat = new __chat__(this, this.sstatus);
    this.helper = new __helper__();
    this.sound = new __sound__(this.modals);
    this.formatMessages = new __format_messages__(this.modals);




    $(document).ready(function() {
        main._userName = $('#user-name > button').text().trim();
        onRoomSelected($('#channels-list > li:contains("@entry")'));
        setOnClickListeners();

        $(window).resize();

        // animate new rooms in
        openRooms();
        
        __tip_poster__(main);
        (new __image_upload__(main));
    });

    function openRooms() {
        var DELAY = 100;
        var counter = 0;
        $('#channels-list > li').hide();
        $('#channels-list > li.room-favorite').each(function(_, entry) {
            ++counter;
            setTimeout(function() {
                entry = $(entry);
                var closeButton = entry.find('button > .room-close');
                closeButton.click(function() { onRoomClosed(closeButton); });

                animateRoomAppearance(entry);
                onRoomSelected(entry);
            }, counter * DELAY);
        });
    }


    function setOnClickListeners() {
        // room navigation
        $("#channels-list > li").each(function(_, entry) {
            $(entry).click(function() { onRoomSelected(entry); });
            $(entry).children('button').each(function(_, be) {
                $(be).click(function() { onRoomClosed(be); });
            });
        });

        // log button
        $("#view-chat-log").click(function() {
            onViewChatLogClicked($(this));
        });

        $("#help-button").click(function() {
            document.location = 'help';
        });

        $("#submit-message").keydown(messageProcessor);


        // add "onNewRoomClicked" listeners to all currently existing entries
        $("#add-new-room").click(function() {
            // new rooms that can be clicked to be added
            $("#add-new-room-rooms > li").each(function(_, entry) {
                $(entry).click(function() { onNewRoomClicked(entry); });
            });
        });
    }


    /**
        Takes an "onkeyevent". Returns the key pressed.
    **/
    function getKeyCode(e) {
        var keynum;
        // IE
        if(window.event) {
            keynum = e.keyCode;
        // Netscape/Firefox/Opera
        } else if(e.which) {
            keynum = e.which;
        }
        return keynum;
    }

    this.isStatusPersistent = false;

    /*
        Make a new status message that vanishes after a certain amount of time.
        To let it be persistent, set the main.isStatusPersistent boolean to true. 
        Don't forget to afterwards set it to {@code false} again for future status messages.
        @param message Your status message
        @param alertClass The color scheme of the alert, e.g. alert-success, alert-info, alert-warning, ...
        @param duration [optional] The duration of your message. Default is 5000 ms.
    */
    this.setCurrentStatus = function(message, alertClass) {
        var duration = arguments[2] === undefined ? 5000 : arguments[2];

        var siteStatus= $('#site-status');
        // scroll old message up if necessary
        if(siteStatus.css('margin-top') !== '-50px') {
            siteStatus.animate({"margin-top": "-50px"}, 1000, function() {
                main.setCurrentStatus(message, alertClass, arguments[2]);
            });
            return;
        }

        removeAlertClasses(siteStatus);
        siteStatus.addClass(alertClass);
        siteStatus.html(message);

        siteStatus.animate({"margin-top": "22px"}, 1000);
        setTimeout(function() {
            if(main.isStatusPersistent) {
                return;
            }
            siteStatus.animate({"margin-top": "-50px"}, 1000);
        }, duration);
    };


    this.makeAttendeeEntry = function(userId, userName) {
        /*
        // items with dropdown
        var content = '<li class="btn-group" id="channel-attendees-'+ userId +'">'+
                        '<button class="btn">'+ userName +'</button>'+
                        '<button class="btn dropdown-toggle" data-toggle="dropdown">'+
                            '<span class="caret"></span>'+
                        '</button>'+
                            '<ul class="dropdown-menu">'+
                            '<li><a href="#">View info</a></li>'+
                            '<li><a href="#">Open private chat</a></li>'+
                            '<li class="divider"></li>'+
                            '<li><a href="#">Ignore</a></li>'+
                            '</ul>'+
                    '</li>';
        */
        var content =    '<li id="channel-attendees-'+ userId +'">'+
                            '<button disabled class="btn">'+ userName +'</button>'+
                        '</li>';

        return content;
    };

    /*
        Yes, it is case sensitive
    */
    function attendeesNameCompletion(text) {
        var roomName = main.helper.getSimpleText(main._activeRoom);
        var names = main.sstatus.logChannelAttendees[roomName];
        var BreakException = {};


        try {
            var lcText = text.toLowerCase();
            names.forEach(function(entry) {
                var lcUsername = entry.userName.toLowerCase();
                if(lcUsername.indexOf(lcText) === 0) {
                    text = entry.userName + ' ';
                    throw BreakException();
                }
            });
        } catch(e) {
            // that's a hack for leaving the forEach
        }

        return text;
    }

    /**
        Processes all characters pressed
    **/
    function messageProcessor(e) {
        var INPUT_CHARACTER_LIMIT = 500;

        var keyCode = getKeyCode(e);
        var submitMessage = $('#submit-message');
        switch(keyCode) {
            case 13:
                if(inputLimiter()) {
                    var message = main.helper.escape(submitMessage.val()).trim();
                    if(message.length > 0) {
                        if(message.length > INPUT_CHARACTER_LIMIT) {
                            message = message.substr(0, INPUT_CHARACTER_LIMIT);
                        }
                        main.chat.sendMessage(message, $('#user-id').text(), main._userName, main._activeRoom.data('roomid'), main.helper.getSimpleText(main._activeRoom));
                        submitMessage.val("");
                    }
                }
                break;
            case 9:
                var text = submitMessage.val();
                if(text !== '') {
                    e.preventDefault();
                    submitMessage.val(attendeesNameCompletion(text));
                }
                break;
            default:
        }


    }

    this.addVisibleImage = function(userName, roomName, url, time) {
        url = 
                '<span class="image-tooltip">' +
                '<img src="' + url + '"></img>' +
                '<span><img src="' + url + '"></img></span>' +
                '</span>';

        main.addVisibleMessage(userName, roomName, url, time, true);
    };



    function isCurrentUserAddressed(message) {
        var regex = new RegExp(".*[\\s:;.,-_!|<>]?"+main._userName+"[\\s:;.,-_!|<>]?.*", "g");

        return function() {
            return regex.test(message);
        }();
    }

    this.logChatMessage = function(roomName, userName, message, time) {        
        if(main.sstatus.logMessages[roomName] === undefined)
            main.sstatus.logMessages[roomName] = [];
        if(main.sstatus.logUsers[roomName] === undefined)
            main.sstatus.logUsers[roomName] = [];
        if(main.sstatus.logTimes[roomName] === undefined)
            main.sstatus.logTimes[roomName] = [];

        main.sstatus.logMessages[roomName].push(message);
        main.sstatus.logUsers[roomName].push(userName);
        main.sstatus.logTimes[roomName].push(time);
    }

    /**
        A new message was added.
        Note that it is not necessarily one from the currently logged in user.
    **/
    this.addVisibleMessage = function(userName, roomName, message, time) {
        main.logChatMessage(roomName, userName, message, time)
        if(roomName != main.helper.getSimpleText(main._activeRoom)) {
            var room = $('#channels-list').find('li:contains("'+roomName+'")');
            // we check for userName, because it might be our joins/quits bot
            if(userName != '' && isCurrentUserAddressed(message)) {
                main.sound.playUserAddressed();
                $.titleAlert("Someone talked to you!");
                room.removeClass('room-favorite');
                room.addClass('btn-danger');
            } else {
                var unseenMessages = room.children('.unseen-messages');
                var msgCount = parseInt(unseenMessages.text(), 10);
                if(msgCount === 0) {
                    unseenMessages.show('slow');
                }
                unseenMessages.text(msgCount + 1);
            }
        } else {
            var entry;
            if(arguments[4] === true) {
                entry = main.makeEntryImage(userName, message, time);
            } else {
                entry = main.makeEntryMessage(userName, message, time);
            }
            var chatEntries = $('#chat-entries');
            chatEntries.append(entry);

            // we assume that a message is max "500px" heigh (image or small browser window)
            chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 500}, 100);

            var children = entry.children();
            var maxHeight = $(children[2]).height();
            $(children[0]).height(maxHeight);
            $(children[1]).height(maxHeight);


            main.modals.liveUpdateChatTextSize();
        }
    };

    function updateChatBox() {
        var chatEntries = $('#chat-entries');
        chatEntries.empty();

        var roomName = main.helper.getSimpleText(main._activeRoom);
        if(main.sstatus.logMessages[roomName] === undefined) {
            return;
        }

        var len = main.sstatus.logMessages[roomName].length;
        for(var i=0; i<len; ++i) {
            var userName = main.sstatus.logUsers[roomName][i];
            if(userName == main._userName) {
                userName = '<b>' + userName + '</b>';
            }
            chatEntries.append(main.makeEntryMessage(userName, main.sstatus.logMessages[roomName][i], main.sstatus.logTimes[roomName][i]));
        }
        main.modals.liveUpdateChatTextSize();
        $(window).resize();
        chatEntries.scrollTop(chatEntries.height());
    }

    function onViewChatLogClicked(_) {
        document.location = 'log/' + encodeURIComponent(main.helper.getSimpleText(main._activeRoom));
    }


    this.updateAttendeesList = function() {
        var roomName = main.helper.getSimpleText(main._activeRoom);
        if(main.sstatus.logChannelAttendees[roomName] === undefined) {
            return;
        }

        var attendeesList = $('#channel-attendees-entries');
        attendeesList.empty();

        var currentAttendees = main.sstatus.logChannelAttendees[roomName];
        for(var i=0; i<currentAttendees.length; ++i) {
            var entry = currentAttendees[i];
            attendeesList.append(main.makeAttendeeEntry(entry.userId, entry.userName));
        }
    };


    var _closeRoomClicked = false;
    function onRoomSelected(newRoom) {
        if(_closeRoomClicked) {
            _closeRoomClicked = false;
            return;
        }

        if(main._activeRoom === undefined) {
            main._activeRoom = $('<span/>');
        }

        newRoom = $(newRoom);
        var room = newRoom.html();
        var oldRoom = main._activeRoom.html();

        if(newRoom.attr('id') === 'add-new-room'){
            return;
        }


        var newRoomName = main.helper.getSimpleText(newRoom);
        if(main.sstatus.logChannelAttendees[newRoomName] === undefined) {
            main.sstatus.logChannelAttendees[newRoomName] = [];
        }

        if(room != oldRoom) {
            removeButtonClasses(main._activeRoom);
            removeButtonClasses(newRoom);
            newRoom.addClass('btn-primary');
            if(isRoomFavorite(oldRoom)) {
                main._activeRoom.addClass('room-favorite');
            }

            main._activeRoom = newRoom;
            updateChatBox();
            main.updateAttendeesList();

            $('#submit-message').focus();
            $('#chat-header-topic').text(main.formatMessages.styleMessage(newRoom.data('topic')));

            // reset "unseen message" counter
            var unseenMessages = newRoom.children('.unseen-messages');
            unseenMessages.hide('slow');
            unseenMessages.text('0');
        }
    }

    function removeButtonClasses(obj) {
        obj.removeClass('btn-warning');
        obj.removeClass('btn-danger');
        obj.removeClass('btn-primary');
        obj.removeClass('btn-info');
        obj.removeClass('btn-success');
    }

    function removeAlertClasses(obj) {
        obj.removeClass('alert-warning');
        obj.removeClass('alert-error');
        obj.removeClass('alert-info');
        obj.removeClass('alert-success');
    }


    function onRoomClosed(obj) {
        _closeRoomClicked = true;

        var room = $(obj).parent();
        var roomName = main.helper.getSimpleText(room);
        var roomId = room.data('roomid');

        room.css("maxHeight", room.height());
        room.animate({"width": "0", "padding-left": "0", "padding-right":"0"}, 200, 'swing', function() {room.remove();});

        if(room.parent().children().length <= 1) {
            main.disableInput();
        }

        // make it available to be added
        addAvailableRoom(room.data('roomid'), main.helper.getSimpleText(room), room.data('topic'));

        // announce
        main.chat.sendUserQuit(roomId, roomName);
        delete main.sstatus.logChannelAttendees[roomName];
    }

    function isRoomFavorite(roomName) {
        for(var i=0; i<main.sstatus.favoriteRooms.length; ++i) {
            if(main.sstatus.favoriteRooms[i].roomName === roomName) {
                return true;
            }
        }
        return false;
    }

    function onNewRoomClicked(obj) {
        main.enableInput();

        // get basic info
        var roomInList = $(obj);
        var roomName = roomInList.text();
        var roomId = roomInList.data('roomid');
        var roomTopic = roomInList.data('topic');

        main.chat.sendUserJoin(roomId, roomName);
        main._activeRoom.removeClass('btn-primary');
        $('#chat-header-topic').html(roomTopic);
        $('#chat-entries').empty();

        var entry = main.openRoom(roomId, roomName, roomTopic);

        // animate popover
        var popover = $('#add-new-room').next();
        var popoverLeft = parseInt(popover.css('left'), 10);
        var width = entry.width();
        var paddingLeft = entry.css('padding-left');
        var newRoomWidth = width + 2 * parseInt(paddingLeft, 10) + 6; // width, padding, margin
        var newLeft = popoverLeft + newRoomWidth;
        popover.animate({"left": newLeft}, 200);

        animateRoomAppearance(entry);

        // animate removed entry
        roomInList.animate({'height': 0, 'padding-top':0, 'padding-bottom':0}, 200, function() {
            roomInList.remove();
            // remove them in the invisible list too
            $('#add-new-room-popover > div:nth-child(2) ul > li:contains("' + roomName + '")').remove();
        });

        main._activeRoom = entry;
    }

    function animateRoomAppearance(entry) {
        var paddingLeft = entry.css('padding-left');
        var width = entry.width();


        entry.css("maxHeight", entry.height());
        entry.width(0);
        entry.css('padding-left', 0);
        entry.css('padding-right', 0);
        entry.show();
        entry.animate({"width": width, "padding-left": paddingLeft, "padding-right": paddingLeft}, 200, function() {
            entry.removeAttr('style');
        });
    }


    /*
        Open a new room within a new tab.
        @return The <li> entry created for this room
    */
    this.openRoom = function(id, name, topic) {
        var classes = '';
        if(isRoomFavorite(name)) {
            classes = 'room-favorite';
        }

        var entry = $('<li class="btn btn-primary '+classes+'"/>');
        entry.attr('data-roomId', id);
        entry.attr('data-topic', topic);
        entry.text(name);

        onRoomSelected(entry);
        entry.click(function() { onRoomSelected(entry); });
        var closeButton = $('<button class="close room-close">&times;</button>');
        closeButton.click(function () { onRoomClosed(closeButton[0]); });
        entry.append(closeButton);
        $('#channels-list').append(entry);

        return entry;
    }

    /*
        Add a room to the list of all available, joinable rooms. 
        If you add a room, it will be displayed within the list after you click the '+' to add a room. 
    */
    function addAvailableRoom(roomId, roomName, roomTopic) {
        var root = $('#add-new-room-popover > div:nth-child(2) ul');
        
        var extraClasses = '';
        if(isRoomFavorite(roomName)) {
            extraClasses = 'room-favorite';
        }

        var entry = $(document.createElement('li'))
        .addClass('ui-bootstrap-list-item btn ' + extraClasses)
        .data('roomid', roomId)
        .data('topic', roomTopic)
        .text(roomName);

        entry.click(function() { onNewRoomClicked(entry[0]); });
        root.append(entry);
    }

    /* 
        Enable input boxe(s) for chatting.
    */
    this.enableInput = function () {
        var submitMessage = $('#submit-message');
        var chatEntries = $('#chat-entries');

        chatEntries.removeAttr('disabled');
        submitMessage.removeAttr('disabled');
        submitMessage.focus();

        $('.view-chat-log').show();
    };

    this.disableInput = function() {
        var submitMessage = $('#submit-message');
        var chatEntries = $('#chat-entries');

        chatEntries.attr('disabled', 'disabled');
        submitMessage.attr('disabled', 'disabled');
        submitMessage.blur();

        $('#chat-header-topic').text('');
        $('.view-chat-log').hide();
    };

    var _inputLimit = [];
    /*
        Returns true if input is allowed, false otherwise
    */
    function inputLimiter() {
        var LIMIT = 5;
        var TIME_SPAN = 3000;

        _inputLimit.push(new Date().getTime());
        if(_inputLimit.length > LIMIT) {
            _inputLimit.shift();

            if(_inputLimit[LIMIT-1] - _inputLimit[0] > TIME_SPAN) {
                return true;
            } else {
                var submitStatus = $('#submit-status');
                if(!submitStatus.is(':visible')) {
                    submitStatus.removeClass();
                    submitStatus.empty();
                    submitStatus.addClass('alert alert-error');


                    submitStatus.append('<h4>Man, calm down!</h4>');
                    submitStatus.append('You mission is not to spam the room. :P').hide().show('slow');

                    setTimeout(function(){
                        submitStatus.hide('quick');
                    }, 5000);
                }

                return false;
            }
        }

        return true;
    }

    /************************************************************************
        Entry makers
    ************************************************************************/
    this.makeEntryMessage = function(userName, message, time) {
        message = main.formatMessages.styleMessage(message);
        return makeEntry(userName, message, time);
    };

    this.makeEntryImage = function(userName, message, time) {
        // message isn't styled up
        return makeEntry(userName, message, time);
    };

    function makeEntry(userName, message, time) { 
        var optionClass = "";
        if(userName === "server") {
            optionClass = "server-message";
        }
   
        if(userName === main._userName) {
            userName = '<b>' + userName + '</b>'; 
        }

        var entryText = 
                '<div class="chat-entry '+ optionClass +'">' +
                    '<span class="chat-entry-options">'+main.helper.toHHMMSS(time)+'</span>' +
                    '<span class="chat-entry-user ">&nbsp;'+userName+'</span>' +
                    '<span class="chat-entry-message">'+message+'' + 
                '</div>';


        return $(entryText);
    }

});