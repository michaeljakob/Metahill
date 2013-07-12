#!/bin/bash
# minify and cat vendors

<<COMMENT
<!-- <script src="js/vendor/jquery-2.0.3.min.js" ></script>
<script src="js/vendor/bootstrap.min.js" ></script>
<script src="js/vendor/bootstrap-select.min.js" ></script>
<script src="js/vendor/jquery-ui-1.10.3.custom.min.js" ></script>
<script src="js/vendor/jquery.filterList.js" ></script>
<script src="js/vendor/jquery.titlealert.min.js" ></script> -->
COMMENT

compiler=/Users/michaeljakob/Documents/Development/Web-Release/google\ closure\ compiler/compiler.jar

java -jar "$compiler" \
    --warning_level QUIET \
    --js    jquery-2.0.3.min.js \
            bootstrap.min.js \
            bootstrap-select.min.js \
            jquery-ui-1.10.3.custom.min.js \
            jquery.filterList.js \
            jquery.titlealert.min.js \
    > vendor.js

