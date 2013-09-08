#!/bin/bash
# minify and cat metahill scripts
# --compilation_level ADVANCED_OPTIMIZATIONS
# --warning_level QUIET

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
            html.js \
            database.js \
    > combined.js



echo "Compile files individually"
for js_file in *.js
do
    java -jar "$compiler" --warning_level QUIET --js "$js_file" > "$js_file.tmp"
    mv "$js_file.tmp" "$js_file"
done