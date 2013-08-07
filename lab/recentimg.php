<?php


$files = glob("../image-upload/Michael.*");
if(!empty($files)) {
    echo "<hr class='fade-gray'>";
    echo "<ul>";

    usort($files, create_function('$a,$b', 'return filemtime($a) - filemtime($b);'));
    $i = 0;
    foreach($files as $file) {
        if($i >= 10) {
            break;
        }
        ++$i;
        echo "<li><img src='$file'/></li>";
    }

    echo "</ul>";
}