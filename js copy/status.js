/// jshint settings
/*global */

function __status__() {
    this.favoriteRooms = []; // array of {roomId: roomId, roomName: roomName}
    this.logMessages = {};
    this.logUsers = {};
    this.logTimes = {};
    this.logChannelAttendees = {}; // array of [roomName]'s, containing {"userId": userId, "userName": userName}

    var sstatus = this;
    var helper = new __helper__();

    $('#channels-list .room-favorite').each(function(index, element) {
        var e = $(element);
        sstatus.favoriteRooms.push({roomId: e.data('roomid'), roomName: helper.getSimpleText(e)});
    });

}