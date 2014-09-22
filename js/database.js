metahill.db = {};

$(function() {

    metahill.db.addFavoriteRoom = function($room) {
        if(!metahill.main.isGuest) {
            var data = 
            { 
                userId: metahill.main.userId, 
                roomId: $room.attr('data-roomid'),
                position: $('#channels-list').children().length + 1
            };
            metahill.helper.submitHttpRequest('add-favorite.php', data);
        }
    };

    metahill.db.removeFavoriteRoom = function($room) {
        if(!metahill.main.isGuest) {
            var data = 
            {   
                position: $room.index()+1, 
                userId: metahill.main.userId, 
                roomId: $room.attr('data-roomid') 
            };
            metahill.helper.submitHttpRequest('remove-favorite.php', data);
        }
    };

    /**
     * Set a new room as the one that is selected when you reload the page.
     * @param {jQuery} room A jQuery room object :)
     */
    metahill.db.setActiveRoom = function($room) {
        if(!metahill.main.isGuest) {
            var data = 
            { 
                userId: metahill.main.userId,
                activeRoom: $room.index()
            };
            metahill.helper.submitHttpRequest('update-activeroom.php', data);
        }
    };

});