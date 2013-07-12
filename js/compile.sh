#!/bin/bash
# minify and cat metahill scripts

<<COMMENT
<!-- 
    <script src="js/base.js" ></script>
    <script src="js/helper.js" ></script>
    <script src="js/sound.js" ></script>
    <script src="js/format-messages.js" ></script>
    <script src="js/image-upload.js"></script>
    <script src="js/tip-poster.js"></script>
    <script src="js/main.js" ></script>
    <script src="js/modals.js" ></script>
    <script src="js/init.js" ></script>
    <script src="js/google-web-fonts.js" ></script>
    <script src="js/room-proposer.js" ></script>
    <script src="js/chat.js"></script>
-->
COMMENT

compiler=/Users/michaeljakob/Documents/Development/Web-Release/google\ closure\ compiler/compiler.jar

java -jar "$compiler" \
    --warning_level QUIET \
    --js    base.js \
            helper.js \
            sound.js \
            format-messages.js \
            image-upload.js \
            tip-poster.js \
            main.js \
            modals.js \
            init.js \
            google-web-fonts.js \
            room-proposer.js \
            chat.js \
    > combined.js

