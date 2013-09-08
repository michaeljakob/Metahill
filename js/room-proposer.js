metahill.roomProposer = {};

$(document).ready(function() {
    $('#add-new-room').click(function() {
        metahill.roomProposer.addRoomSearcher($('#add-new-room-search'));
    });
});

metahill.roomProposer.getOpenRoomNames = function() {
    var entries  = $('#channels-list').children('li');

    var names = [];
    entries.each(function(index) {
        names.push(metahill.helper.getSimpleText($(this)));
    });
    return names;
};

metahill.roomProposer.createHtmlChildren = function(rooms) {
    function createHtmlChild(room) {
        var attributes = '';
        attributes += "data-owner='"+room.owner+"' ";
        attributes += "data-roomid='"+room.id+"' ";
        attributes += "data-is-private='"+room.is_private+"' ";

        var content = room.name;
        if(room.is_private === 1) {
            content += metahill.html.getPrivateRoomImage();
        }

        var html = "<li class='ui-bootstrap-list-item btn' " +
                   attributes + 
                   "data-topic='"+(room.topic)+"'>"+content+"</li>";

        return html;
    }

    var alreadyListedRoomNames = metahill.roomProposer.getOpenRoomNames();

    var children = '';
    for(var i=0; i<rooms.length; i++) {
        var room = rooms[i];
        if($.inArray(room.name, alreadyListedRoomNames) === -1) {
            children += createHtmlChild(room);
        }
    }

    // add "No rooms found" message if neccessary
    if(children === '') {
        children = '<p class="btn" disabled>No rooms found :(</p>';
    }


    return children;
};

metahill.roomProposer.addRoomSearcher = function(inputBox) {
   inputBox.bind('propertychange keyup input paste', function() {
        var search = inputBox.val();
        metahill.roomProposer.requestRoomsFromSearchTerm(search);
    });
};

metahill.roomProposer.requestRoomsFromSearchTerm = function(search) {
    var message = {
        intent: 'search-rooms',
        searchTerm: search
    };

    metahill.chat.connection.send(JSON.stringify(message));
};

metahill.roomProposer.handleIncomingSearchResults = function(rooms) {
    var children = metahill.roomProposer.createHtmlChildren(rooms);
    var addNewRooms = $('#add-new-room-rooms');
    addNewRooms.empty().append(children);

    addNewRooms.children('li').each(function(_, entry) {
        $(entry).click(function() { metahill.main.onNewRoomClicked(entry); });
    });
};

/**
 * Request rooms that could be interesting for the current user
 */
metahill.roomProposer.requestRoomProposals = function() {
    var message = { 
        intent: 'room-proposals',
        userId: metahill.main.userId, 
        userName: metahill.main.userName
    };
    metahill.chat.connection.send(JSON.stringify(message));
};

metahill.roomProposer.handleIncomingRoomProposals = function(rooms) {
    var children = metahill.roomProposer.createHtmlChildren(rooms);
    $('#add-new-room-rooms').append(children);
};

