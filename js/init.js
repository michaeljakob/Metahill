/// jshint settings
/*global window, document, $, */


$(function() {
    $(document).ready(function() {
        var css;
        if(metahill.base.support.isMac) {
            // close buttons 'x' on the left side :)
            css = '<style>.room-close{left:auto;right:20px;}.close{float:left;}</style>';
            $(css).appendTo('body');
        }
        if(metahill.base.support.isWindows || metahill.base.support.isFirefox) {
            // include some windows specific fixes
            css = '<link rel="stylesheet" type="text/css" href="css/windows-fixes.css"/>';
            $(css).appendTo('head');
        }
    });


    $(window).on('resize', $.debounce(250, function() {
        // keep scrolled to bottom
        var chatEntries = $('#chat-entries');
        chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 700}, 500);
    }));

    $(window).resize((function() {
        var submitArea = $('#submit-area');
        var channelAttendeesEntries = $('#channel-attendees-entries');
        var header = $('header');
        var submitSwitchTheme = $('#submit-switch-theme');
        var addedChatEntriesHeight = parseInt($('#data-added-chat-entries-height').css('margin-top'), 10);

        var h = -1;
        var w = -1;
        return function() {
            var nh = $(window).height();
            var nw = $(window).width();

            var chatEntries = $('#chat-entries-' + metahill.main.activeRoom.attr('data-roomid'));

            if(w !== nw) {
                chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 700}, 500);

                if(nw <= 800) {
                    submitSwitchTheme.addClass('submit-switch-theme-absolute');
                } else {
                    submitSwitchTheme.removeClass('submit-switch-theme-absolute');
                }

                w = nw;
            }

            if(h !== nh) {
                // min-height
                if(!metahill.base.support.isEmbedded && nh < 500) {
                    submitArea.addClass('height-limiter');
                    chatEntries.height(190 + addedChatEntriesHeight);
                    return;
                } else {
                    submitArea.removeClass('height-limiter');
                }
                h = nh;
            }

            // we always check for scrollability - it is the most important thing
            var attendeesBarHeight = $(this).height() - header.height() - submitArea.height() - 90;
            channelAttendeesEntries.height(attendeesBarHeight + 50 + addedChatEntriesHeight);

            if(!metahill.base.support.isEmbedded) {
                chatEntries.height(attendeesBarHeight - 50 + addedChatEntriesHeight);
            } else {
                chatEntries.height(attendeesBarHeight + 105 + addedChatEntriesHeight);
            }
        };
    })()); // window.resize
    
    $('.selectpicker').selectpicker();
    $('#add-new-room').popover({ 
        trigger: 'click',
        html: true,
        title: function() {
            return $('#add-new-room-title').html();
        },
        content: function() {
            return $('#add-new-room-content').html();
        }
    }).click(function() {
        if(!metahill.main.isEmbedded) {
            $('#add-new-room-search').focus();
        }
    });

    // remove "add-new-room"-popover if you click anywhere
    $('body').on('click', function (e) {
        var submitMessage = $('#submit-message');
        $('#add-new-room, #submit-smiley').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $('#submit-smiley').popover({ 
        trigger: 'click',
        html: true,
        title: function() {
            return $('#submit-smiley-title').html();
        },
        content: function() {
            return $('#submit-smiley-content-parent').html();
        }
    }).click(function() {
        $('#submit-smiley-content img').click(function() {
            $('#submit-smiley').popover('hide');
            var imageUrl = 'http://www.metahill.com/' + $(this).attr('src');
            var roomId = metahill.main.activeRoom.attr('data-roomid');
            var roomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
            metahill.chat.sendImage(imageUrl, metahill.main.userId, metahill.main.userName, roomId, roomName);
        });
    });

    $('#chat-entries-parent').mousedown(function() {
        $('#submit-message').focus();
    });
        
    // filter
    $('#filter-search-user')
    .filterList()
    .keydown(function(e) {
        // disable ENTER
        if(e.keyCode === 13) {
            e.preventDefault();
        }
    });
});

// channels-list Sortable (dragging room positions)
$(function() {
    var startIndex = -1;
    $('#channels-list').sortable({
        start: function(event, ui) {
            startIndex = ui.item.index(0);
        },
        stop: function(event, ui) {
            var endIndex = ui.item.index();

            var json = {};
            json.startPosition = startIndex + 1;
            json.endPosition = endIndex + 1;
            json.roomId = ui.item.attr('data-roomid');
            json.userId = metahill.main.userId;

            if(!metahill.main.isGuest) {
                metahill.helper.submitHttpRequest('update-room-positions.php', json);
                metahill.helper.submitHttpRequest('update-activeroom.php', { userId: metahill.main.userId, activeRoom: metahill.main.activeRoom.index()});
            }
        }

    });
});




