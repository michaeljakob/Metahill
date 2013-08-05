/// jshint settings
/*global document, console, $, XMLHttpRequest, FormData */

$(function() {

    document.onpaste = function(e){
        var items = e.clipboardData.items;
        console.log(JSON.stringify(items));
        if (e.clipboardData.items[1].kind === 'file') {
            // get the blob
            var imageFile = items[1].getAsFile();
            console.log(imageFile);
            var reader = new FileReader();
            reader.onload = function(event) {
                console.log(event.target.result); // data url!
                submitFileForm(event.target.result, 'paste');
            };
            reader.readAsBinaryString(imageFile);
        }
    };

    var dropElement = document.body;
    var isDragging = null;

    var timerId = 0;
    function doDrag() {
        if(metahill.main.isGuest) {
            return;
        }
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
        
        if(metahill.main.isGuest) {
            var activeRoomName = metahill.helper.getSimpleText(metahill.main.activeRoom);
            metahill.main.addVisibleMessage('', activeRoomName, "Guests are not allowed to share images", new Date());
            return;
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
            submitFileForm(file, 'drag');
        }
        return false;
    };

    function submitFileForm(file, type) {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('userName', metahill.main.userName);
        formData.append('submissionType', type);

        var entry = $(metahill.main.makeEntryImageText(metahill.main.userName, metahill.main.activeRoom, 'http://www.metahill.com/img/loading.gif', new Date().getTime()));
        var chatEntries = $('#chat-entries-' + metahill.main.activeRoom.attr('data-roomid'));
        chatEntries
        .append(entry)
        .animate({ scrollTop: chatEntries.scrollTop() + 700}, 500);


        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/image-upload.php');
        xhr.onload = function () {
            entry.remove();
            if (xhr.status == 200) {
                var fileName = xhr.getResponseHeader('Content-Description');
                console.log('all done: ' + xhr.status + ':' + fileName);
                metahill.chat.sendImage(fileName, metahill.main.userId, metahill.main.userName, metahill.main.activeRoom.attr('data-roomid'), metahill.helper.getSimpleText(metahill.main.activeRoom));
            } else {
                //console.log('Something went terribly wrong...' + xhr.status  + ': ' + xhr.statusText);
                console.log('Nope');
            }
        };
        
        xhr.send(file);
    }
});