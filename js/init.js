/// jshint settings
/*global window, document, $, */


$(function() {
    $(document).ready(function() {
        var css;
        if(metahill.base.support.isMac) {
            // close buttons 'x' on the left side :)
            css = '<style>.room-close{left:auto;right:20px;}.close{float:left;}</style>';
            $(css).appendTo('body');
        } else if(metahill.base.support.isWindows) {
            // include some windows specific fixes
            css = '<link rel="stylesheet" type="text/css" href="css/windows-fixes.css"/>';
            $(css).appendTo('head');
        }



        $(window).on('resize', $.debounce(250, function() {
            // keep scrolled to bottom
            var chatEntries = $('#chat-entries');
            chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 700}, 500);
        }));

        $(window).resize((function() {
            var submitArea = $('#submit-area');
            var channelAttendeesEntries = $('#channel-attendees-entries');
            var chatEntries = $('#chat-entries');
            var header = $('header');

            var h = -1;
            var w = -1;
            return function() {
                var nh = $(window).height();
                var nw = $(window).width();

                if(w !== nw) {
                    bringRowHeightInOrder();
                    // keep scrolled to bottom
                    chatEntries.animate({ scrollTop: chatEntries.scrollTop() + 700}, 500);

                    w = nw;
                }

                if(h !== nh) {
                    // min-aheight
                    if(!metahill.base.support.isEmbedded && nh < 500) {
                        submitArea.addClass('height-limiter');
                        chatEntries.height(190);
                        return;
                    } else {
                        submitArea.removeClass('height-limiter');
                    }

                    var attendeesBarHeight = $(this).height() - header.height() - submitArea.height() - 90;
                    channelAttendeesEntries.height(attendeesBarHeight + 50);

                    if(!metahill.base.support.isEmbedded) {
                        chatEntries.height(attendeesBarHeight - 50);
                    } else {
                        chatEntries.height(attendeesBarHeight + 85);
                    }

                    h = nh;
                }
            };
        })());
        
        $(window).resize();
    });

    /*
        Make option, username and message div be the same height.
    */
    function bringRowHeightInOrder() {
        var chatEntries = $('#chat-entries');
        chatEntries.children().each(function(_, element) {
            var children = $(element).children();
            var maxHeight = $(children[2]).height();
            $(children[0]).height(maxHeight);
            $(children[1]).height(maxHeight);
        });
    }
    
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
    }).click((function() {
        var addNewRoomSearch = $('#add-new-room-search');
        return function() {
            addNewRoomSearch.focus();
        };
    })());


    // remove "add-new-room"-popover if you click anywhere
    $('body').on('click', function (e) {
        var submitMessage = $('#submit-message');
        $('#add-new-room').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
        
    // filter
    $('#filter-search-user').filterList();
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

            metahill.helper.submitHttpRequest('update-room-positions.php', json);
            metahill.helper.submitHttpRequest('update-activeroom.php', { userId: metahill.main.userId, activeRoom: metahill.main.activeRoom.index()});
        }

    });
});




