metahill.roomProposer = {};

$(document).ready(function() {
    $('#add-new-room').click(function() {
        metahill.roomProposer.addRoomSearcher($('#add-new-room-search'));
    });
});

metahill.roomProposer.getOpenRoomNames = function() {
    var entries  = $('#channels-list').children();

    var names = [];
    entries.each(function(index) {
        names.push(metahill.helper.getSimpleText($(this)));
    });
    return names;
};


metahill.roomProposer.createHtmlChildren = function(rooms) {
    var alreadyListedRoomNames = metahill.roomProposer.getOpenRoomNames();

    var children = '';
    for(var i=0; i<rooms.length; i++) {
        var room = rooms[i];
        if($.inArray(room.name, alreadyListedRoomNames) === -1) {
            children += "<li class='ui-bootstrap-list-item btn' data-owner='"+room.owner+"'sn data-roomid='"+room.id+
                                          "' data-topic='"+room.topic+"'>"+room.name+"</li>";
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

    addNewRooms.children().each(function(_, entry) {
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

