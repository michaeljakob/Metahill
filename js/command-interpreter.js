metahill.main.command = metahill.main.command || {};
metahill.main.command.latestWhisperPartner = '';

$(function() {

    var ESCAPE_SYMBOL = '/';

    var ERROR_REGISTERED_ONLY_TITLE = atob('SSBmZWVsIHJlYWwgc29ycnksIGJ1dC4uLg=='); // I feel real sorry, but...
    var ERROR_REGISTERED_ONLY_MESSAGE = atob('Li4udGhpcyBmZWF0dXJlIGlzIHJlc2VydmVkIHRvIHJlZ2lzdGVyZWQgdXNlcnMu'); // ...this feature is reserved to registered users.

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
        var content;
        switch(command) {
            case 'blog':
                metahill.main.addSystemMessage('You can find the blog at www.metahill.com/blog');
                break;
            case 'help':
                metahill.main.addSystemMessage('You can find the help at www.metahill.com/help');
                break;
            case 'enter':
            case 'join':
                var destRoomName = args[1];
                var destRoomPassword = args[2];
                if(destRoomName === undefined) {
                    metahill.main.setSubmitStatus('Join what? :)', 'Did you forget to append a room-name?');
                    return true;
                }
                var foundOpenRoom = false;
                $('#channels-list').children().each(function(_,e) {
                    var actualRoomName = metahill.helper.getSimpleText($(e));
                    if(actualRoomName.toLowerCase() === destRoomName.toLowerCase()) {
                        metahill.main.selectRoom(metahill.main.getRoomFromName(actualRoomName));
                        foundOpenRoom = true;
                        return;
                    }
                });
                if(foundOpenRoom) {
                    return true;
                }
                var url = 'dev/rest/get-room-object-from-name.php';
                metahill.helper.submitHttpRequestGeneral(url, {room: destRoomName}, function(text) {
                    if(text !== 'null') {
                        var room = JSON.parse(text); 
                        room.topic = metahill.helper.quotesEncode(room.topic);
                        if((room.password === null) || (destRoomPassword === room.password)) {
                            var newRoom = '<li data-roomid="'+room.id+'" data-topic="'+room.topic+'" data-owner="'+room.owner+'">'+room.name+'</li>';
                            metahill.main.onNewRoomClicked($(newRoom));
                        } else {
                            if(destRoomPassword === undefined || parseInt($.cookie('join.tries'),10) > 20) {
                                metahill.main.setSubmitStatus('Sorry, but…', 'The room "'+ destRoomName +'" is password-protected!');
                            } else {
                                var tries = parseInt($.cookie('join.tries'),10);
                                if(isNaN(tries)) {
                                    tries = 0;
                                }
                                var expirationDate = new Date();
                                expirationDate.setHours(expirationDate.getHours() + 1);
                                $.cookie('join.tries', tries + 1, {expires: expirationDate });
                                metahill.main.setSubmitStatus('Nice try', 'You entered an invalid password :}');
                            }
                        }
                    } else {
                        metahill.main.setSubmitStatus('Sorry, but…', 'Apparently the room "'+ destRoomName +'" does not exist!');
                    }
                });
                break;
            case 'part':
            case 'exit':
            case 'quit':
                if(args[1] === undefined) {
                    metahill.main.closeRoom(metahill.helper.getSimpleText(metahill.main.activeRoom));
                } else {
                    roomName = args[1];
                    if(getLowerCaseOpenRoomNames().indexOf(roomName.toLowerCase()) !== -1) {
                        metahill.main.closeRoom(roomName);
                    } else {
                        metahill.main.setSubmitStatus('Sorry, but…', 'You are in no room "' + roomName + '".');
                    }
                }
                break;
            case 'mute':
                destUserName = args[1];
                if(args[2] === undefined || args[3] === undefined) {
                    metahill.main.setSubmitStatus('Missing duration', 'Append one of "20 minutes", "1 hour", "3 hours" or "1 day".');
                    return true;
                }
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
                        metahill.main.setSubmitStatus('wat', 'You specified an invalid duration.');
                        return true;
                }

                if(metahill.base.user.that.mayReignOver(destUserName)) {
                    if(destUserName === metahill.main.userName) {
                        metahill.main.setSubmitStatus('wat', 'You want to mute yourself? o_o');
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
                    metahill.main.addVisibleMessage('', roomName,  'Right. Oo', new Date());
                }
                break;
            case 'me':
                var status = args.splice(1).join(' ');
                if(status === '') {
                    metahill.main.setSubmitStatus('What are you doing?', 'Append a status or deed, e.g. "is awesome".');
                    return true;
                }
                content = '' + metahill.main.userName + ' ' + status;
                metahill.chat.sendMessage(content, 1, '', roomId, roomName);
                break;
            case 'nick':
                metahill.main.setSubmitStatus('All names are unique.', 'Contact an admin if you\'d still like to change it.');
                break;
            case 'whisper':
            case 'msg':
            case 'pmsg':
                content = args.splice(2).join(' ');
                destUserName = args[1];
                sendWhisper(destUserName, roomName, content);
                break;
            case 'map':
            case 'maps':
                requiresRegisteredUser();
                if(metahill.main.isGuest) {
                    return true;
                }

                var location = '';
                var words = args.splice(1);
                for(var i=0; i<words.length; ++i) {
                    words[i] = words[i].replace(/("|')/g, '');
                    location += words[i][0].toUpperCase() + words[i].slice(1).toLowerCase() + ' ';
                }
                if(!(/^[a-zA-Z0-9-_, ]*$/.test(location))) {
                    metahill.main.setSubmitStatus('Are you sure?', 'This doesn\'t really look like a sensible location :/.');
                    return true;
                }


                if(location !== '') {
                    var googleMapsUrl = 'https://maps.google.com/?output=embed&t=h&q=' + encodeURI(location);
                    metahill.chat.sendMessage('_' + location + '_ on Google Maps: ' + googleMapsUrl, metahill.main.userId, metahill.main.userName, roomId, roomName);
                } else {
                    metahill.main.setSubmitStatus('No location specified', 'Append a location, such as "New York"!');
                }
                break;
            case 'yt':
            case 'youtube':
                requiresRegisteredUser();
                if(metahill.main.isGuest) {
                    return true;
                }
                if(args[1] !== undefined) {
                    var youtubeKeyword = args.splice(1).join(' ').replace(/("|')/g, '');
                    var youtubeKeywordForUrl = encodeURI(youtubeKeyword);
                    console.log(youtubeKeywordForUrl);
                    var youtubeUrl = 'https://gdata.youtube.com/feeds/api/videos?max-results=1&alt=json&q='+youtubeKeywordForUrl;
                    metahill.helper.submitHttpRequestGeneral(youtubeUrl, {}, function(text) {
                        var video = JSON.parse(text);
                        if(video.feed.entry !== undefined) {
                            var videoUrl = video.feed.entry[0].link[0].href;
                            videoUrl = videoUrl.substring(0, videoUrl.lastIndexOf('&'));
                            metahill.chat.sendMessage('_' + youtubeKeyword + '_ on YouTube: ' + videoUrl, metahill.main.userId, metahill.main.userName, roomId, roomName);
                        } else {
                            metahill.main.setSubmitStatus('Sorry, but…', 'There apparently were no matches!');
                        }
                    }, 'get');
                } else {
                    metahill.main.setSubmitStatus('No search term specified', 'Append a search term, such as "King of Math Android"!');   
                }
                break;
            case 'topic':
                metahill.main.addSystemMessage('Topic: ' + metahill.main.activeRoom.attr('data-topic'));
                break;
            case 'names':
            case 'attendees':
                var numAttendees = metahill.log.roomAttendees[roomName].length;
                var attendees = '';
                for(var attendeeName in metahill.log.roomAttendees['metahill']) { 
                    attendees += attendeeName + ', ';
                }
                attendees = attendees.slice(0, -2);
                metahill.main.addSystemMessage('The following users are in this room: ' + attendees + '.');
                break;
            case 'commands':
                metahill.main.addSystemMessage('The following commands exist: blog, help, join, quit, youtube (yt), map, whisper, me, topic, attendees. To be continued...');
                break;
            default:
                return false;
        }

        return true;
    };

    function requiresRegisteredUser() {
        if(metahill.main.isGuest) {
            metahill.main.setSubmitStatus(atob(ERROR_REGISTERED_ONLY_TITLE), atob(ERROR_REGISTERED_ONLY_MESSAGE));
        }
    }

    function getLowerCaseOpenRoomNames() {
        var arr = [];
        $('#channels-list').children().each(function(_,e) {
            arr.push(metahill.helper.getSimpleText($(e)).toLowerCase());
        });

        return arr;
    }

    function sendWhisper(destUserName, roomName, content) {
        if(content.trim() === '') {
            metahill.main.setSubmitStatus('You still need to append the actual message', 'Try the form /whisper &lt;username&gt; &lt;message&gt;.');
            return;
        }

        var currentAttendees = metahill.log.roomAttendees[roomName];
        if(currentAttendees[destUserName] === undefined) {
            metahill.main.setSubmitStatus('Which ' + destUserName + '?', 'The user "' + destUserName + '" is not currently in this room.');
            return true;
        }

        var whisperMessage = { 
            intent: 'whisper',
            srcUserName: metahill.main.userName, 
            destUserName: destUserName,
            content: content,
            roomName: roomName 
        };
        metahill.main.addVisibleMessage(whisperMessage.srcUserName, roomName, content, new Date(), false, 'whispered-message', 'data-to="'+ destUserName + '"');
        metahill.chat.connection.send(JSON.stringify(whisperMessage));
    }

    /**
     * This method will try to autocomplete all valid commands.
     * If a completion is possible, it is directly made by accessing the 
     * submit input box.
     * @return {bool} true if a completion was done, false otherwise
     */
    metahill.main.command.tryCompletion = (function() {
        // two words may NOT start with the same character
        var words = ['blog', 'help', 'join', 'enter', 'me', 'whisper', 'respond', 'quit', 'part', 'youtube'];
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
                if(com[text] === 'respond') {
                    var additionalSpace = (metahill.main.command.latestWhisperPartner==='')?'':' ';
                    $('#submit-message').val(ESCAPE_SYMBOL + 'whisper ' + metahill.main.command.latestWhisperPartner + additionalSpace);
                } else {
                    $('#submit-message').val(ESCAPE_SYMBOL + com[text] + ' ');
                }
                return true;
            } else {
                if(text === 'yt') {
                    $('#submit-message').val(ESCAPE_SYMBOL + 'youtube ');
                    return true;
                }
            }
            return false;
        };
    })();

     
});