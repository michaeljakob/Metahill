/// jshint settings
/*global window, $, console, __helper__, setTimeout, WebSocket */



function __chat__(main) {
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
    var helper = new __helper__();
    var roomProposer;

    var connection_onopen = function () {
        thatChat.isOnline = true;
        connectionFailedFirstTime = true;


        // join favorite rooms    
        main.sstatus.favoriteRooms.forEach(function(entry) {
            thatChat.sendUserJoin(entry.roomId, entry.roomName);
        });

        roomProposer = new __room_proposer__(connection, main._userName, main.sstatus.favoriteRooms, main);
        main.enableInput();
        setTimeout(function() {
            main.isStatusPersistent = false;
            main.setCurrentStatus('Welcome back!', 'alert-success');
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
            main.disableInput();
            removeAllChannelAttendees();
            
            main.isStatusPersistent = true;
            main.setCurrentStatus("Awwr. It seems we got a server problem. We're working on it...", 'alert-error', -1);
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
                main.addVisibleMessage(json.userName, json.roomName, json.content, json.time);
                break;
            case 'tell-image':
                main.addVisibleImage(json.userName, json.roomName, json.content, json.time);
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
        if(main.sstatus.logChannelAttendees[roomName] === undefined) {
            main.sstatus.logChannelAttendees[roomName] = [];    
        }
        main.sstatus.logChannelAttendees[roomName].push({"userId": userId, "userName": userName});
        
        var isActiveRoom = roomName === helper.getSimpleText(main._activeRoom);
        if(isActiveRoom) {
            $('#channel-attendees-entries').append(main.makeAttendeeEntry(userId, userName));
        }

        writeSystemMessage(roomName, userName + ' joined the room.');
    }
    
    function onUserQuit(userId, userName, roomName) {    
        console.log('userquit:' + userId + ' in ' + roomName);    
        // this should never be triggered
        if(main.sstatus.logChannelAttendees[roomName] === undefined) {
            console.log('userquit with undefined roomName');
            return;
        }
        
        for(var i=0; i<main.sstatus.logChannelAttendees[roomName].length; ++i) {
            if(main.sstatus.logChannelAttendees[roomName][i].userId === userId) {
                main.sstatus.logChannelAttendees[roomName].remove(i);
            }
        }        
        
        var isActiveRoom = roomName === helper.getSimpleText(main._activeRoom);
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

        if(main.modals.preferences.chat_show_traffic) {
            main.addVisibleMessage(userName, roomName, message, time);
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
        main.sstatus.logChannelAttendees = {};
        $('#channel-attendees-entries').empty();        
    }
    
    /************************************************************************
        Methods for the outer world following
    ************************************************************************/
    this.updateAttendeesList = function (list, roomId, roomName) {
        var channelAttendeesEntries = $('#channel-attendees-entries');           
        if(roomName === helper.getSimpleText(main._activeRoom)) {
            channelAttendeesEntries.empty();
        }
        
        if(main.sstatus.logChannelAttendees[roomName] === undefined) {
            main.sstatus.logChannelAttendees[roomName] = [];    
        }

        var isActiveRoom = roomName === helper.getSimpleText(main._activeRoom);
        var tmp = '';
        list.forEach(function(entry) {
            main.sstatus.logChannelAttendees[roomName].push({'userId': entry.userId, 'userName': entry.userName});
            if(isActiveRoom) {
                tmp += main.makeAttendeeEntry(entry.userId, entry.userName);
            }
        });
        channelAttendeesEntries.append(tmp);
    };
    
    this.sendUserQuit = function(roomId, roomName) {    
        var userId = $('#user-id').html();
        
        return function(roomId, roomName) {
            var entryMessage = { 
                intent: 'quit-room',
                userId: userId, 
                userName: main._userName, 
                roomId: roomId, 
                roomName: roomName 
            };
            connection.send(JSON.stringify(entryMessage));
        };        
    }();
    
    this.sendUserJoin = function(roomId, roomName) {    
        var userId = $('#user-id').html();
        
        return function() {
            var entryMessage = { 
                intent: 'join-room', 
                userId: userId, 
                userName: main._userName, 
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









