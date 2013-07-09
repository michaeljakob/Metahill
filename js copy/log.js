
$(function() {

    var format = new __format_messages__();

    $('chat-entry-message').each(function(index, entry) {
        entry.html(format.styleMessage(entry.html()));
    });

});














