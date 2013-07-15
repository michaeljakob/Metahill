<?php

    $directory = "../img/smilies";

    $texts = glob($directory . "*.png");

    //print each file name
    foreach($texts as $text)
    {
        $text = substr($text, 2);
        echo "<tr>\n";
        echo "    <td><img src='../img/smilies/" . $text . "'></img></td>\n";
        echo "    <td>". substr($text, 0, -4) ."</td>\n";
        echo "    <td></td>\n";
        echo "</tr>\n";
    }


    /*

                                <tr>
                                    <td><img src="../img/smilies/angry.png"></img></td>
                                    <td>angry</td>
                                    <td></td>
                                </tr>
                                */