function __status__(){this.favoriteRooms=[];this.logMessages={};this.logUsers={};this.logTimes={};this.logChannelAttendees={};var b=this,c=new __helper__;$("#channels-list .room-favorite").each(function(e,d){var a=$(d);b.favoriteRooms.push({roomId:a.data("roomid"),roomName:c.getSimpleText(a)})})};
