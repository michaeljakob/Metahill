#!/bin/bash
# minify and cat metahill scripts
# --compilation_level ADVANCED_OPTIMIZATIONS
# --warning_level QUIET
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
    <script src="js/room-proposer.js" ></script>
    <script src="js/chat.js"></script>
-->
COMMENT

compiler=/Users/michaeljakob/Documents/Development/Web-Release/google\ closure\ compiler/compiler.jar
echo "Generating combined.js"

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
            room-proposer.js \
            chat.js \
            "command-interpreter.js" \
    > combined.js



echo "Compile files individually"
for js_file in *.js
do
    java -jar "$compiler" --warning_level QUIET --js "$js_file" > "$js_file.tmp"
    mv "$js_file.tmp" "$js_file"
done