/*
    #add-new-room-rooms
    -> "<li class='ui-bootstrap-list-item btn' data-roomid='$roomId' data-topic='$topic'>$roomName</li>";

    #modal-pref-nonfavorite-rooms
    -> same inhere

*/
function __room_proposer__(connection, userName, favoriteRooms) {
    var roomProposer = this;

    this.addRoomSearcher = function() {
        return function(inputBox) {
            inputBox.bind('propertychange keyup input paste', function() {
                var search = inputBox.val();
                console.log(search);
            });
        };
    }();


    /**
     * Request rooms that could be interesting for the current user
     * @param  {array} exclusionList An integer array holding all roomIds that should not be proposed.
     */
    this.addRoomProposals = function(exclusionList) {
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
        var children = "";
        for(var i=0; i<rooms.length; i++) {
            var room = rooms[i];
            children += "<li class='ui-bootstrap-list-item btn' data-roomid='"+room.id+
                                              "' data-topic='"+room.topic+"'>"+room.name+"</li>";
        }
        $('#add-new-room-rooms').append($(children));
        $('#modal-pref-nonfavorite-rooms').append($(children));
    };


    exclusionList = [];
    favoriteRooms.forEach(function(entry) {
        exclusionList.push(entry.roomId);
    });
    this.addRoomProposals(exclusionList);

    $('#add-new-room').click(function() {
        roomProposer.addRoomSearcher($('#main-container #add-new-room-search'));
    });
    this.addRoomSearcher($('#pref-select-favorite-channels-search'));

}