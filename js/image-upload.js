/// jshint settings
/*global document, console, $, XMLHttpRequest, FormData */

$(function() {
    var dropElement = document.body;
    var isDragging = null;

    var timerId = 0;
    function doDrag() {
        timerId = setInterval(function() {
            if(isDragging) {
                $('#drag-and-drop-overlay').fadeIn(500);
            } else {
                $('#drag-and-drop-overlay').fadeOut(500);
                isDragging = null;
                clearInterval(timerId);
            }
        },64);
    }

    dropElement.ondragover = function () {
        if(isDragging === null || isDragging === undefined) {
            doDrag();
        }

        isDragging = true;
        return false; 
    };

    dropElement.ondragleave = function () {
        isDragging = false;
        return false;
    };

    dropElement.ondrop = function (event) {
        if(event.preventDefault !== null) {
            event.preventDefault();
        }
        isDragging = false;
        doDrag();

        var files = event.dataTransfer.files;
        var file = files[0];  // we only want one file, no more

        if (file === undefined) {
            return;
        }
        
        var acceptedTypes = {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true,
            'image/svg+xml': true
        };
        
        if (acceptedTypes[file.type] === true) {
            var formData = new FormData();
            formData.append('file', file);
            
            var imageText = metahill.main.makeImageTagFromUrl('http://metahill.com/img/loading.gif');
            var entry = $(metahill.main.makeEntryImageText(metahill.main.userName, imageText, new Date().getTime()));
            $('#chat-entries').append(entry);


            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'php/image-upload.php');
            xhr.onload = function () {
                if (xhr.status == 200) {
                    var fileName = xhr.getResponseHeader('Content-Description');
                    console.log('all done: ' + xhr.status + ':' + fileName);
                    entry.remove();
                    metahill.chat.sendImage(fileName, metahill.main.userId, metahill.main.userName, metahill.main.activeRoom.attr('data-roomid'), metahill.helper.getSimpleText(metahill.main.activeRoom));
                } else {
                    console.log('Something went terribly wrong...' + xhr.status  + ':' + xhr.statusText);
                }
            };
            
            xhr.send(formData);
        }
        return false;
    };
});