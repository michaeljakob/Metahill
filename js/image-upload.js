/// jshint settings
/*global document, console, $, XMLHttpRequest, FormData */

function __image_upload__(main) {
    var dropElement = document.body;

    dropElement.ondragenter = function() {
    }

    dropElement.ondragover = function () {
        this.className = 'hover';
        //$("#drag-and-drop-overlay").show();
        return false; 
    };

    dropElement.ondragleave = function () {
        this.className = '';
        //$("#drag-and-drop-overlay").hide();
        return false;
    };

    dropElement.ondrop = function (event) {
        //$("#drag-and-drop-overlay").hide();
        if(event.preventDefault !== null) {
            event.preventDefault();
        }
        this.className = '';
        
        var files = event.dataTransfer.files;
        var file = files[0];

        if (file === undefined) {
            return;
        };
        
        var acceptedTypes = {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true,
            'image/svg+xml': true
        };
        
        if (acceptedTypes[file.type] === true) {
            var formData = new FormData();
            formData.append('file', file); // we only want one file, no more
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'php/image-upload.php');
            xhr.onload = function () {
                if (xhr.status == 200) {
                    var fileName = xhr.getResponseHeader('Content-Description');
                    console.log('all done: ' + xhr.status + ':' + fileName);
                    var helper = new __helper__();
                    main.chat.sendImage(fileName, $('#user-id').html(), main._userName, main._activeRoom.data('roomid'), helper.getSimpleText(main._activeRoom));
                } else {
                    console.log('Something went terribly wrong...' + xhr.status  + ':' + xhr.statusText);
                }
            };
            
            xhr.send(formData);
        }
        return false;
    };
}