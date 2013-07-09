<?php

require_once('db-interface.php');
$dbh = getDBH();

/////////////////////////////////////////////////////////////
// incoming values
/////////////////////////////////////////////////////////////
$enableSmilies = $_POST['enable_smilies'] === 'true';
$enableFormatting = $_POST['enable_formatting'] === 'true';
$enableNotificationSounds = $_POST['enable_notification_sounds'] === 'true';
$enableTips = $_POST['enable_tips'] === 'true';
$chatShowTraffic = $_POST['chat_show_traffic'] === 'true';
$chatTextSize = $_POST['chat_text_size'];
$userId = $_POST['user_id'];
$chatTextFont = $_POST['chat_text_font'];


$success = true;
$dbh->beginTransaction();
/////////////////////////////////////////////////////////////
// update preferences 
/////////////////////////////////////////////////////////////
$statement = $dbh->prepare('UPDATE `accounts`
                            SET chat_text_size=:chat_text_size,
                                enable_smilies=:enable_smilies,
                                enable_formatting=:enable_formatting,
                                enable_notification_sounds=:enable_notification_sounds,
                                enable_tips=:enable_tips,
                                chat_show_traffic=:chat_show_traffic,
                                chat_text_font=:chat_text_font
                            WHERE id = :user_id;');

$param = array( ':chat_text_size' => $chatTextSize, 
                ':enable_smilies' => $enableSmilies, 
                ':enable_formatting' => $enableFormatting, 
                ':enable_notification_sounds' => $enableNotificationSounds, 
                ':enable_tips' => $enableTips,
                ':chat_show_traffic' => $chatShowTraffic,
                ':chat_text_font' => $chatTextFont,
                ':user_id' => $userId);

// var_dump($param);
$success &= $statement->execute($param);

/////////////////////////////////////////////////////////////
// return some sign of life
/////////////////////////////////////////////////////////////
if($success) {
    header('Status: 200 OK');
} else {
    header('Status: 400 Bad Request');
    header('Content-Description: ' . var_dump($statement->errorInfo()));
}






