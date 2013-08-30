/// jshint settings
/*global window, $, console, setTimeout, WebSocket */


metahill.chat = {};
metahill.chat.connection = {};
$(function(){
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        console.log('Sorry, but your browser doesn\'t support WebSockets.');
    }

    // open connection
    var mAddress = 'ws://127.0.0.1:1337';
    //var mAddress = 'ws://81.169.246.231:443';

    metahill.chat.isOnline = true;

    var RETRY_DELAY = 30000;
    var mConnectionFailedFirstTime = true;

    var connection_onopen = function() {
        metahill.chat.isOnline = true;
        mConnectionFailedFirstTime = true;

        // join favorite rooms 
        var favoriteRooms = []; // array of {roomId: roomId, roomName: roomName}
        $('#channels-list').children().each(function(index, element) {
            var e = $(element);
            favoriteRooms.push({roomId: e.attr('data-roomid'), roomName: metahill.helper.getSimpleText(e)});
        });  
        favoriteRooms.forEach(function(entry) {
            metahill.chat.sendUserJoin(entry.roomId, entry.roomName);
        });

        metahill.roomProposer.requestRoomProposals();
        setTimeout(function() {
            metahill.main.isStatusPersistent = false;
            metahill.main.setCurrentStatus('Welcome back!', 'alert-success');
        }, 1000);
    };

    var connection_onerror = function (error) {
        metahill.chat.isOnline = false;
        console.log('Sorry, but there\'s some problem with your connection or the server is down. ' + error);
    };


    var connection_onclose = function () {
        metahill.chat.isOnline = false;
        if(mConnectionFailedFirstTime) {
            mConnectionFailedFirstTime = false;
            metahill.main.disableInput();
            removeAllChannelAttendees();
            
            metahill.main.isStatusPersistent = true;
            metahill.main.setCurrentStatus('Awwr. It seems there is a server issue. We got that!', 'alert-error', -1);
        }
        setTimeout(function() {
            setupConnection();
            console.log('retry');
        }, RETRY_DELAY);
    };
    
    // handle incoming messages
    var connection_onmessage = function (message) {
        //console.log('message received: ' + JSON.stringify(message.data));
        var json = JSON.parse(message.data);
        var intent = json.intent;
        switch(intent) {
            case atob('dGVsbA=='): // tell
                metahill.main.addVisibleMessage(json.userName, json.roomName, json.content, json.time);
                break;
            case atob('dGVsbC1pbWFnZQ=='): // tell-image
                metahill.main.addVisibleImage(json.userName, json.roomName, json.content, json.time);
                break;
            case atob('YXR0ZW5kZWVzLWxpc3Q='): // attendees-list
                metahill.chat.updateAttendeesList(json.attendees, json.roomId, json.roomName);
                break;
            case atob('cXVpdC1yb29t'): // quit-room
                onUserQuit(json.userId, json.userName, json.roomName);
                break;
            case atob('am9pbi1yb29t'): // join-room
                onUserJoin(json.userId, json.userName, json.roomName);
                break;
            case atob('bGF0ZXN0LWNoYXQtZW50cmllcw=='): // latest-chat-entries
                addLatestChatEntries(json.roomId, json.roomName, json.entries);
                break;
            case atob('cm9vbS1wcm9wb3NhbHM='): // room-proposals
                metahill.roomProposer.handleIncomingRoomProposals(json.list);
                break;
            case atob('c2VhcmNoLXJvb21z'): // search-rooms
                metahill.roomProposer.handleIncomingSearchResults(json.list, json.inputSource);
                break;
            case atob('d2hpc3Blcg=='): // whisper
                metahill.main.command.latestWhisperPartner = json.srcUserName;
                metahill.main.addVisibleMessage(json.srcUserName, json.roomName, json.content, json.time, false, 'whispered-message', 'title="Click or type \'/r your_message\' respond."');
                break;
            case atob('bXV0ZQ=='): // mute
                onUserMute(json);
                break;
            case atob('cmVsb2Fk'): // reload
                location.reload();
                break;
            default:
                console.log('Unknown `intent`.');
        }
    };
    
    setupConnection();
    
    
    /************************************************************************
        Events & Callbacks
    ************************************************************************/
    function onUserMute(json) {
        var mutedTime = 'unspecified time';
        switch(json.mutedTime) {
            case 20:
                mutedTime = '20 minutes';
                break;
            case 60:
                mutedTime = '1 hour';
                break;
            case 180:
                mutedTime = '3 hours';
                break;
            case 1440:
                mutedTime = '1 day';
                break;
        }

        var content;

        // this user was muted
        if(json.userName === metahill.main.userName) {
            if(json.roomId === metahill.main.activeRoom.attr('data-roomid')) {
                $('#submit-message').prop('disabled', true).blur();
            }
            metahill.main.mutedRoomIds.push(json.roomId);
            content = 'You have been muted for ' + mutedTime + ' within this room.';
            metahill.main.unmuteRoomId(json.roomId, json.mutedTime * 60 * 1000);
        } else {
            content = 'The user ' + json.userName + ' has been muted for ' + mutedTime + ' within this room.';
        }
        metahill.main.addVisibleMessage('', json.roomName, content, json.time);
    }

    function addLatestChatEntries(roomId, roomName, entries) {
        var room = $('#channels-list').find('li:contains("'+roomName+'")');

        var cache = '';
        for(var i=0; i<entries.length; ++i) {
            var entry = entries[i];
            if(entry.is_image) {
                cache += metahill.main.makeEntryImageText(entry.account_name, room, entry.content, entry.submitted_time, 'logged-message');
            } else {
                cache += metahill.main.makeEntryMessageText(entry.account_name, room, entry.content, entry.submitted_time, 'logged-message');
            }
        }

        var div = $(document.createElement('div'));
        div
        .attr('id', 'chat-entries-' + roomId)
        .append(cache);
        var activeRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        $('#chat-entries-parent').append(div);
        if(activeRoomName !== roomName) {
            div.hide();
        } else {
            var activeRoomId = metahill.main.activeRoom.attr('data-roomid');
            var newChatEntries = $('#chat-entries-' + activeRoomId);
            newChatEntries.show();
        }

        metahill.modals.liveUpdateChatTextSize();
    }

    function onUserJoin(userId, userName, roomName) {
        if(metahill.log.roomAttendees[roomName] === undefined) {
            metahill.log.roomAttendees[roomName] = {};
        }
        metahill.main.enableInput();

        if(metahill.log.roomAttendees[roomName][userName] === undefined) {
            var u = {};
            u.id = userId;
            u.numLogins = 1;

            metahill.log.roomAttendees[roomName][userName] = u;

            var isActiveRoom = roomName === metahill.helper.getSimpleText(metahill.main.activeRoom);
            if(isActiveRoom) {
                if(userName !== metahill.main.userName) {
                    addJoinQuitMessage(roomName, userName + ' joined the room.');
                }
                $('#channel-attendees-entries').append(metahill.main.makeAttendeeEntryText(userId, userName));
            }
        } else {
            ++metahill.log.roomAttendees[roomName][userName].numLogins;
        }
    }
    
    function onUserQuit(userId, userName, roomName) {    
        // should never be triggered
        if(metahill.log.roomAttendees[roomName] === undefined) {
            console.log('userquit with undefined roomName');
            return;
        }

        --metahill.log.roomAttendees[roomName][userName].numLogins;
        if(metahill.log.roomAttendees[roomName][userName].numLogins === 0) {
            delete metahill.log.roomAttendees[roomName][userName];     
        
            var isActiveRoom = roomName === metahill.helper.getSimpleText(metahill.main.activeRoom);
            if(isActiveRoom) {
                if(userName !== metahill.main.userName) {
                    addJoinQuitMessage(roomName, userName + ' quit the room.');
                }
                $('#channel-attendees-' + userId).remove();
            }
        }

    }

    /************************************************************************
        Helper functions
    ************************************************************************/
    function addJoinQuitMessage(roomName, message) {
        if(metahill.modals.preferences.chat_show_traffic) {
            metahill.main.addSystemMessage(message);
        }
    }

    function setupConnection() {
        metahill.chat.connection = new WebSocket(mAddress);
        metahill.chat.connection.onopen = connection_onopen;
        metahill.chat.connection.onerror = connection_onerror;
        metahill.chat.connection.onclose = connection_onclose;
        metahill.chat.connection.onmessage = connection_onmessage;
    }    
    
    function removeAllChannelAttendees() {
        metahill.log.roomAttendees = {};
        $('#channel-attendees-entries').empty();        
    }
});

/************************************************************************
    Methods for the outer world following
************************************************************************/
metahill.chat.updateAttendeesList = function(userList, roomId, roomName) {
    metahill.log.roomAttendees[roomName] = userList;

    var isActiveRoom = roomName === metahill.helper.getSimpleText(metahill.main.activeRoom);
    if(isActiveRoom) {
        var channelAttendeesEntries = $('#channel-attendees-entries');           
        channelAttendeesEntries.empty();
        var cache = '';
        for(var name in userList) {
            cache += metahill.main.makeAttendeeEntryText(userList[name].id, name);
        }
        channelAttendeesEntries.append(cache);
    }
};

metahill.chat.sendUserQuit = function(roomId, roomName) { 
    var entryMessage = { 
        intent: 'quit-room',
        userId: metahill.main.userId, 
        userName: metahill.main.userName, 
        roomId: roomId, 
        roomName: roomName 
    };
    metahill.chat.connection.send(JSON.stringify(entryMessage));
};

metahill.chat.sendUserJoin = function(roomId, roomName) {    
    var entryMessage = { 
        intent: 'join-room', 
        userId: metahill.main.userId, 
        userName: metahill.main.userName, 
        roomId: roomId, 
        roomName: roomName 
    };
    metahill.chat.connection.send(JSON.stringify(entryMessage));
};


/**
 * Send a message to the chat server.
 * @return {bool} true on success, false on failure
 */
metahill.chat.sendMessage = (function() {
    var isSubmitAllowed = (function(){
        var MESSAGE_LIMIT = 3;
        var TIME_SPAN = 3000;
        var submissionTimes = [];

        return function(message) {
            if(message.trim().length === 0) {
                return false;
            }

            submissionTimes.push(new Date().getTime());
            if(submissionTimes.length > MESSAGE_LIMIT) {
                submissionTimes.shift();
                
                if(submissionTimes[MESSAGE_LIMIT-1] - submissionTimes[0] > TIME_SPAN) {
                    return true;
                } else {
                    metahill.main.setSubmitStatus('Man, calm down!', 'Your mission is not to spam the room. :P');
                    return false;
                }
            }
            return true;
        };
    })();

    return function(message, userId, userName, roomId, roomName) {
        var isActiveRoomMuted = metahill.main.mutedRoomIds.indexOf(metahill.main.activeRoom.attr('data-roomid')) !== -1;
        if(isActiveRoomMuted) {
            return false;
        }
        if(userName !== metahill.main.userName && userName !== '') {
            return false;
        }
        if(!isSubmitAllowed(message)) {
            return false;
        }

        var messageObject = { 
            content: message, 
            intent: atob('dGVsbA=='), // tell 
            userId: userId, 
            userName: userName, 
            roomId: roomId, 
            roomName: roomName 
        };

        metahill.chat.connection.send(JSON.stringify(messageObject));
        return true;
    };
})();

metahill.chat.isImageSubmitAllowed = (function() {
    return function() {
        var isActiveRoomMuted = metahill.main.mutedRoomIds.indexOf(metahill.main.activeRoom.attr('data-roomid')) !== -1;
        if(isActiveRoomMuted) {
            metahill.main.setSubmitStatus('Well..', 'You have been muted in this room.');
            return;
        }
        var now = new Date().getTime();
        var lastSubmissionTime = $.cookie('chat.lst') || 0;
        var submitTimeDelta = now - lastSubmissionTime;
        if(submitTimeDelta > 60*1000) {
            $.cookie('chat.lst', now);
            return true;
        }
        var timeLeftUntilNextSubmit = Math.round((60*1000 - submitTimeDelta)/1000);
        metahill.main.setSubmitStatus('Awwr', 'You can share one image each 60 seconds. '+timeLeftUntilNextSubmit+' seconds left.');
        return false;
    };
})();

metahill.chat.sendImage = function(imageUrl, userId, userName, roomId, roomName) {
    var isActiveRoomMuted = metahill.main.mutedRoomIds.indexOf(metahill.main.activeRoom.attr('data-roomid')) !== -1;
    if(isActiveRoomMuted) {
        return;
    }

    var messageObject = { 
        content: imageUrl, 
        intent: atob('dGVsbC1pbWFnZQ=='), // tell-image 
        userId: userId, 
        userName: userName, 
        roomId: roomId, 
        roomName: roomName
    };

    metahill.chat.connection.send(JSON.stringify(messageObject));
    return true;
};








