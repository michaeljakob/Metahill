/*
    #add-new-room-rooms
    -> "<li class='ui-bootstrap-list-item btn' data-roomid='$roomId' data-topic='$topic'>$roomName</li>";

    #modal-pref-nonfavorite-rooms
    -> same inhere

*/
function __room_proposer__(connection, userName, favoriteRooms, main) {
    var roomProposer = this;

    this.createHtmlChildren = function(rooms) {
        var children = "";
        for(var i=0; i<rooms.length; i++) {
            var room = rooms[i];
            children += "<li class='ui-bootstrap-list-item btn' data-owner="+room.owner+" data-roomid='"+room.id+
                                              "' data-topic='"+room.topic+"'>"+room.name+"</li>";
        }
        return children;
    };

    this.addRoomSearcher = function(inputBox, inputSourceName) {
       inputBox.bind('propertychange keyup input paste', function() {
            var search = inputBox.val();
            roomProposer.requestRoomsFromSearchTerm(search, inputSourceName);
        });
    };

    this.requestRoomsFromSearchTerm = function(search, inputSourceName) {
        var message = {
            intent: 'search-rooms',
            searchTerm: search,
            inputSource: inputSourceName
        };

        connection.send(JSON.stringify(message));
    };

    this.handleIncomingSearchResults = function(rooms, inputSource) {
        var children = roomProposer.createHtmlChildren(rooms);

        switch(inputSource) {
            case 'main':
                $('#add-new-room-rooms').empty();
                $('#add-new-room-rooms').append($(children));

                $('#add-new-room-rooms > li').each(function(_, entry) {
                    $(entry).click(function() { main.onNewRoomClicked(entry); });
                });
                break;
            case 'pref':
                $('#modal-pref-nonfavorite-rooms').empty();
                $('#modal-pref-nonfavorite-rooms').append($(children));
                break;
            default:
                console.log('handleIncomingSearchResults: unknown inputSource');
        }
    };

    /**
     * Request rooms that could be interesting for the current user
     * @param  {array} exclusionList An integer array holding all roomIds that should not be proposed.
     */
    this.requestRoomProposals = function(exclusionList) {
        var userId = $('#user-id').html();
        
        var message = { 
            intent: 'room-proposals',
            userId: userId, 
            userName: userName, 
            list: exclusionList
        };
        connection.send(JSON.stringify(message));
    };

    this.handleIncomingRoomProposals = function(rooms) {
        var children = roomProposer.createHtmlChildren(rooms);
        $('#add-new-room-rooms').append($(children));
        $('#modal-pref-nonfavorite-rooms').append($(children));
    };


    exclusionList = [];
    favoriteRooms.forEach(function(entry) {
        exclusionList.push(entry.roomId);
    });
    this.requestRoomProposals(exclusionList);

    $('#add-new-room').click(function() {
        roomProposer.addRoomSearcher($('#main-container #add-new-room-search'), 'main');
    });
    this.addRoomSearcher($('#pref-select-favorite-channels-search'), 'pref');

}