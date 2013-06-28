/// jshint settings
/*global window, document, $, */

$(function() {
    var helper = new __helper__();

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
    
    // correctly align submit-area
    $(window).resize(function() {
        var chatEntries = $('#chat-entries');
        var h = $(this).height() - $('header').height() - 2 * $('#submit-area').height() + 10;
        chatEntries.height(h-50);
        $('#channel-attendees-entries').height(h-54);
        $('#channel-attendees').height(h);
        
        var windowWidth = $(this).width();
        var bodyMinWidth = parseInt($('body').css('min-width'), 10);
        var chatWidth;
        if(windowWidth > bodyMinWidth) {
            chatWidth = windowWidth;
        } else {
            chatWidth = bodyMinWidth;
        }
        chatWidth -= 200;
        $('#chat').width(chatWidth);
        $('#submit-message').width(chatWidth - 250);
    });
    
    //$('.selectpicker').selectpicker();
    $('#add-new-room').popover({ 
        html: true,
        title: function() {
            return $('#add-new-room-title').html();
        },
        content: function() {
            return $('#add-new-room-content').html();
        }
    });

    // remove "add-new-room"-popover if you click anywhere
    $('body').on('click', function (e) {
        $('#add-new-room').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
    
    // sortables
    $(function() {
        $("#modal-pref-favorite-rooms, #modal-pref-nonfavorite-rooms").sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();

        $('#channels-list').sortable();
        $('#channels-list').disableSelection();
    });
    
    // filter
    $(function() {
        $('#filter-search-user').filterList();
    });
});