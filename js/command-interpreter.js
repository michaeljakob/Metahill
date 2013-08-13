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
                break;
            case 'me':
                break;
            case 'nick':
                break;
            case 'whisper':
            case 'msg':
            case 'pmsg':
                var destUserName = args[1];
                var content = args.splice(2).join(' ');
                var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);

                var currentAttendees = metahill.log.roomAttendees[roomName];
                if(currentAttendees[destUserName] === undefined) {
                    metahill.main.addVisibleMessage('', roomName, 'The user "' + destUserName + '" is not in this room.', new Date(), false, 'whispered-message');
                    return true;
                }

                var entryMessage = { 
                    intent: 'whisper',
                    srcUserName: metahill.main.userName, 
                    destUserName: destUserName,
                    content: content,
                    roomName: roomName 
                };
                metahill.main.addVisibleMessage(entryMessage.srcUserName, roomName, text, new Date(), false, 'whispered-message');
                metahill.chat.connection.send(JSON.stringify(entryMessage));
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
        var words = ['blog', 'help', 'invite', 'join', 'kick', 'whisper', 'msg'];
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