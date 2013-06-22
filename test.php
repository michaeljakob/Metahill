<?php

    $to = 'michael@jakob.tv';
    $subject = 'Activate your cloodi account';

   $message = 'hello';


    $headers = 'From: welcome@cloodi.com\r\n';

    mail($to, $subject, $message, $headers);