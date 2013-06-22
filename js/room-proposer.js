/*
    #add-new-room-rooms
    -> "<li class='ui-bootstrap-list-item btn' data-roomid='$roomId' data-topic='$topic'>$roomName</li>";

    #modal-pref-nonfavorite-rooms
    -> same inhere

*/
function __room_proposer__(connection, userName, favoriteRooms) {

    addRoomProposals(favoriteRooms);

    function addRoomProposals(favoriteRooms) {
        var userId = $('#user-id').html();
        
        return function() {
            exclusionList = [];
            favoriteRooms.forEach(function(entry) {
                exclusionList.push(entry.roomId);
            });


            var message = { 
                intent: 'room-proposals',
                userId: userId, 
                userName: userName, 
                list: exclusionList
            };
            connection.send(JSON.stringify(message));
        }();  
    }

    this.handleIncomingRoomProposals = function(rooms) {
        var children = "";
        for(var i=0; i<rooms.length; i++) {
            var room = rooms[i];
            children += "<li class='ui-bootstrap-list-item btn' data-roomid='"+room.id+
                                              "' data-topic='"+room.topic+"'>"+room.name+"</li>";
        }
        $('#add-new-room-rooms').append($(children));
        $('#modal-pref-nonfavorite-rooms').append($(children));
    }

}