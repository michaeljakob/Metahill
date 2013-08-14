metahill.main.command = metahill.main.command || {};

$(function() {

    var ESCAPE_SYMBOL = '/';

    /**
     * [ description]
     * @param  {[type]} text [description]
     * @return {bool}   Whether the text could be parsed as a valid command
     */
    metahill.main.command.parse = function(text) {
        if(text[0] !== ESCAPE_SYMBOL) {
            return false;
        }

        var args = text.substring(1).split(' ');
        var command = args[0];


        var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        var roomId = metahill.main.activeRoom.attr('data-roomid');

        var destUserName;
        switch(command) {
            case 'blog':
                addSystemText('You can find the blog at www.metahill.com/blog');
                break;
            case 'help':
                addSystemText('You can find the help at www.metahill.com/help');
                break;
            case 'invite':
                break;
            case 'join':
                break;
            case 'kick':
            case 'mute':
                destUserName = args[1];
                var durationString = args[2] + ' ' + args[3];
                var duration;
                switch(durationString) {
                    case '20 minutes':
                        duration = 20;
                        break;
                    case '1 hour':
                        duration = 60;
                        break;
                    case '3 hours':
                        duration = 180;
                        break;
                    case '1 day':
                        duration = 1440;
                        break;
                    default:
                        metahil.main.addVisibleMessage('', roomName,  'You specified an invalid duration.', new Date());
                        return true;
                }

                if(metahill.base.user.that.mayReignOver(destUserName)) {
                    if(destUserName === metahill.main.userName) {
                        metahil.main.addVisibleMessage('', roomName,  'You want to mute yourself? o__o', new Date());
                        return true;
                    }

                    var muteMessage = { 
                        intent: 'mute',
                        userName: destUserName,
                        roomId: roomId,
                        roomName: roomName,
                        mutedTime: duration
                    };

                    metahill.chat.connection.send(JSON.stringify(muteMessage));
                } else {
                    metahil.main.addVisibleMessage('', roomName,  'Right. Oo', new Date());
                }
                break;
            case 'me':
                break;
            case 'nick':
                break;
            case 'whisper':
            case 'msg':
            case 'pmsg':
                var content = args.splice(2).join(' ');
                destUserName = args[1];

                var currentAttendees = metahill.log.roomAttendees[roomName];
                if(currentAttendees[destUserName] === undefined) {
                    metahill.main.addVisibleMessage('', roomName, 'The user "' + destUserName + '" is not in this room.', new Date(), false, 'whispered-message');
                    return true;
                }

                var whisperMessage = { 
                    intent: 'whisper',
                    srcUserName: metahill.main.userName, 
                    destUserName: destUserName,
                    content: content,
                    roomName: roomName 
                };
                metahill.main.addVisibleMessage(whisperMessage.srcUserName, roomName, text, new Date(), false, 'whispered-message');
                metahill.chat.connection.send(JSON.stringify(whisperMessage));
                break;
            default:
                return false;
        }



        return true;
    };

    /**
     * This method will try to autocomplete all valid commands.
     * If a completion is possible, it is directly made by accessing the 
     * submit input box.
     * @return {bool} true if a completion was done, false otherwise
     */
    metahill.main.command.tryCompletion = (function() {
        // two words may NOT start with the same character
        var words = ['blog', 'help', 'invite', 'join', 'mute', 'kick', 'whisper', 'msg'];
        var com = {};
        for(var i=0; i<words.length; ++i) {
            var word = words[i];
            for(var k=1; k<word.length; ++k) {
                com[word.substring(0, k)] = word;
            }
        }

        return function(text) {
            if(text[0] !== ESCAPE_SYMBOL) {
                return false;
            }

            text = text.substring(1).rtrim();
            if(com[text] !== undefined) {
                $('#submit-message').val(ESCAPE_SYMBOL + com[text] + ' ');
                return true;
            }
            return false;
        };
    })();

    function addSystemText(message) {
        var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
        metahill.main.addVisibleMessage('', roomName, message, new Date());
    }
     
});