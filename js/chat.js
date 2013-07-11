/// jshint settings
/*global window, $, console, setTimeout, WebSocket */



function __chat() {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        console.log($('<p>', { text: 'Sorry, but your browser doesn\'t support WebSockets.'}));
    }

    // open connection
    var address = 'ws://127.0.0.1:1337';
    //var address = 'ws://81.169.246.231:80';

    this.isOnline = true;

    var RETRY_DELAY = 30000;
    var connection;
    var connectionFailedFirstTime = true;
    var thatChat = this;
    var roomProposer;

    var connection_onopen = function () {
        thatChat.isOnline = true;
        connectionFailedFirstTime = true;

        // join favorite rooms 
        var favoriteRooms = []; // array of {roomId: roomId, roomName: roomName}
        $('#channels-list').children().each(function(index, element) {
            var e = $(element);
            favoriteRooms.push({roomId: e.attr('data-roomid'), roomName: metahill.helper.getSimpleText(e)});
        });  
        favoriteRooms.forEach(function(entry) {
            thatChat.sendUserJoin(entry.roomId, entry.roomName);
        });

        roomProposer = new __room_proposer__(connection, metahill.main.userName, favoriteRooms, metahill.main);
        metahill.main.enableInput();
        setTimeout(function() {
            metahill.main.isStatusPersistent = false;
            metahill.main.setCurrentStatus('Welcome back!', 'alert-success');
        }, 1000);
    };

    var connection_onerror = function (error) {
        thatChat.isOnline = false;
        console.log('Sorry, but there\'s some problem with your connection or the server is down.</p>');
    };


    var connection_onclose = function () {
        thatChat.isOnline = false;
        if(connectionFailedFirstTime) {
            connectionFailedFirstTime = false;
            metahill.main.disableInput();
            removeAllChannelAttendees();
            
            metahill.main.isStatusPersistent = true;
            metahill.main.setCurrentStatus("Awwr. It seems we got a server problem. We're working on it...", 'alert-error', -1);
        }
        setTimeout(function() {
            setupConnection();
            console.log('retry');
        }, RETRY_DELAY);
    };
    
    // handle incoming messages
    var connection_onmessage = function (message) {
        console.log('message received: ' + JSON.stringify(message.data));
        var json = JSON.parse(message.data);
        var intent = json.intent;
        switch(intent) {
            case 'tell':
                metahill.main.addVisibleMessage(json.userName, json.roomName, json.content, json.time);
                break;
            case 'tell-image':
                metahill.main.addVisibleImage(json.userName, json.roomName, json.content, json.time);
                break;
            case 'attendees-list':
                thatChat.updateAttendeesList(json.attendees, json.roomId, json.roomName);
                break;
            case 'quit-room':
                onUserQuit(json.userId, json.userName, json.roomName);
                break;
            case 'join-room':
                onUserJoin(json.userId, json.userName, json.roomName);
                break;
            case 'room-proposals':
                roomProposer.handleIncomingRoomProposals(json.list);
                break;
            case 'search-rooms':
                roomProposer.handleIncomingSearchResults(json.list, json.inputSource);
                break;
            default:
                console.log('Unknown `intent`.');
        }
    };
    
    setupConnection();
    
    
    /************************************************************************
        Events & Callbacks
    ************************************************************************/
    function onUserJoin(userId, userName, roomName) {
        console.log('userjoin:' + userId + '=' + userName + ' in ' + roomName);
        if(metahill.log.roomAttendees[roomName] === undefined) {
            metahill.log.roomAttendees[roomName] = [];    
        }
        metahill.log.roomAttendees[roomName].push({"userId": userId, "userName": userName});
        
        var isActiveRoom = roomName === metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(isActiveRoom) {
            $('#channel-attendees-entries').append(metahill.main.makeAttendeeEntry(userId, userName));
        }

        writeSystemMessage(roomName, userName + ' joined the room.');
    }
    
    function onUserQuit(userId, userName, roomName) {    
        console.log('userquit:' + userId + ' in ' + roomName);    
        // this should never be triggered
        if(metahill.log.roomAttendees[roomName] === undefined) {
            console.log('userquit with undefined roomName');
            return;
        }
        
        for(var i=0; i<metahill.log.roomAttendees[roomName].length; ++i) {
            if(metahill.log.roomAttendees[roomName][i].userId === userId) {
                metahill.log.roomAttendees[roomName].remove(i);
            }
        }        
        
        var isActiveRoom = roomName === metahill.helper.getSimpleText(metahill.main.activeRoom);
        if(isActiveRoom) {
            $('#channel-attendees-' + userId).remove();
        }

        writeSystemMessage(roomName, userName + ' quit the room.');
    }

    /************************************************************************
        Helper functions
    ************************************************************************/
    function writeSystemMessage(roomName, message) {
        var userName = '';
        var time = new Date();
        message = '_' + message + '_';

        if(metahill.main.modals.preferences.chat_show_traffic) {
            metahill.main.addVisibleMessage(userName, roomName, message, time);
        }
    }

    function setupConnection() {
        connection = new WebSocket(address);
        connection.onopen = connection_onopen;
        connection.onerror = connection_onerror;
        connection.onclose = connection_onclose;
        connection.onmessage = connection_onmessage;
    }    
    
    function removeAllChannelAttendees() {
        metahill.log.roomAttendees = {};
        $('#channel-attendees-entries').empty();        
    }
    
    /************************************************************************
        Methods for the outer world following
    ************************************************************************/
    this.updateAttendeesList = function (list, roomId, roomName) {
        var channelAttendeesEntries = $('#channel-attendees-entries');           
        if(roomName === metahill.helper.getSimpleText(metahill.main.activeRoom)) {
            channelAttendeesEntries.empty();
        }
        
        if(metahill.log.roomAttendees[roomName] === undefined) {
            metahill.log.roomAttendees[roomName] = [];    
        }

        var isActiveRoom = roomName === metahill.helper.getSimpleText(metahill.main.activeRoom);
        var tmp = '';
        list.forEach(function(entry) {
            metahill.log.roomAttendees[roomName].push({'userId': entry.userId, 'userName': entry.userName});
            if(isActiveRoom) {
                tmp += metahill.main.makeAttendeeEntry(entry.userId, entry.userName);
            }
        });
        channelAttendeesEntries.append(tmp);
    };
    
    this.sendUserQuit = function(roomId, roomName) {    
        var userId = metahill.main.userId;
        
        return function(roomId, roomName) {
            var entryMessage = { 
                intent: 'quit-room',
                userId: userId, 
                userName: metahill.main.userName, 
                roomId: roomId, 
                roomName: roomName 
            };
            connection.send(JSON.stringify(entryMessage));
        };        
    }();
    
    this.sendUserJoin = function(roomId, roomName) {    
        var userId = metahill.main.userId;
        
        return function() {
            var entryMessage = { 
                intent: 'join-room', 
                userId: userId, 
                userName: metahill.main.userName, 
                roomId: roomId, 
                roomName: roomName 
            };
            connection.send(JSON.stringify(entryMessage));
        }();
    };
    
    this.sendMessage = function(message, userId, userName, roomId, roomName) {
        var messageObject = { 
            content: message, 
            intent: 'tell', 
            userId: userId, 
            userName: userName, 
            roomId: roomId, 
            roomName: roomName 
        };

        //console.log("message sent: " + JSON.stringify(messageObject));
        connection.send(JSON.stringify(messageObject));
    };
    
    this.sendImage = function(imageUrl, userId, userName, roomId, roomName) {
        var messageObject = { 
            content: imageUrl, 
            intent: 'tell-image', 
            userId: userId, 
            userName: userName, 
            roomId: roomId, 
            roomName: roomName
        };

        console.log(JSON.stringify(messageObject));
        connection.send(JSON.stringify(messageObject));
    };

}









