<?php

require_once('database-config.php');

function getDBH() {
    static $dbh;
    if(!$dbh) {
        $dbh = new PDO( 'mysql:host=' . DATABASE_HOST . 
                        ';dbname=' . DATABASE_NAME, 
                        DATABASE_USER,
                        DATABASE_PASSWORD);

        $dbh->exec('SET CHARACTER SET utf8');
    }
    
    return $dbh;
}

/*
 Check if the given name-pass tuple exists.
 @returns 
  1 -> success
 -1 -> name/password combination does not exist
 -2 -> not verified
*/
function dbVerifyLogin($name, $pass) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT * FROM accounts WHERE (name=:name OR email=:name) AND password=:password' );
    $statement->execute(array(':name' => $name, ':password' => $pass));
    
    if($statement->rowCount() == 0) {
        return -1;
    }

    $account = $statement->fetch(PDO::FETCH_OBJ);
    if($account->is_verified) {
        return $account->name;
    } else {
        return -2;
    }
}


/*
 Returns an array of all rooms except the one within the $ids array.
*/
// TODO this method is basically superfluid :) Still used in index.php for adding further rooms (+ sign)
function dbGetAllRoomsExcept($excluded_ids) {
    $dbh = getDBH();

    $bind = ':'.implode(',:', $excluded_ids);
    $statement = $dbh->prepare('SELECT * 
                                FROM `rooms` 
                                WHERE id NOT IN ( '. $bind .' )');
    $statement->execute(array_combine(explode(',', $bind), array_values($excluded_ids)));
    
    
    return $statement->fetchAll(PDO::FETCH_OBJ);    
}

function dbGetRoomObjectFromId($id) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT * FROM rooms WHERE id=:id' );
    $statement->execute(array(':id' => $id));
    
    return $statement->fetch(PDO::FETCH_OBJ);
}

function dbGetRoomObjectFromName($name) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT * FROM rooms WHERE name=:name');
    $statement->execute(array(':name' => $name));
    
    return $statement->fetch(PDO::FETCH_OBJ);
}

/*
    Returns an array of rooms.
    Each room has the properties id, name and topic.
*/
function dbGetFavoriteRooms($name) {
    $dbh = getDBH();


    $statement = $dbh->prepare('SELECT r.id, r.name, r.topic, r.owner
                                FROM `favorite_rooms` favs
                                INNER JOIN rooms r
                                ON r.id = favs.room_id
                                WHERE account_id = (SELECT id FROM `accounts` WHERE name=:name) 
                                ORDER BY position');
    $statement->execute(array(':name' => $name));
    $rooms = $statement->fetchAll(PDO::FETCH_OBJ);
    return $rooms;
}

/*
 Get username from userid.
*/
function dbGetUserName($id) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT name FROM accounts WHERE id=:id' );
    $statement->execute(array(':id' => $id));
    
    return $statement->fetch(PDO::FETCH_OBJ)->name;
}

/*
 Returns all messages that were posted after the given $age.
 Returns an array of classes, each with the attributes
 - account_name
 - channel_name
 - content
 - submitted_time 
 
 $age in days
*/
function dbGetMessagesObject($roomName, $age) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT a.name AS account_name, c.name AS channel_name, content, submitted_time, is_image
                                    FROM `messages` m
                                    INNER JOIN accounts a
                                    ON a.id = m.account_id
                                    INNER JOIN rooms c
                                    ON c.id = m.channel_id
                                    WHERE submitted_time > :time_threshold
                                    AND c.name = :room_name');

    // 2013-03-30 16:20:00
    $timeThreshold = date('Y-m-d H:i:s', time() - ($age*24*60*60));
    $statement->execute(array(':room_name' => $roomName ,':time_threshold' => $timeThreshold));
    
    return $statement->fetchAll(PDO::FETCH_OBJ);
}


/*
 Check whether the username exists.
*/
function dbUserNameExists($name) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT id FROM accounts WHERE name=:name' );
    $statement->execute(array(':name' => $name));
    
    return $statement->rowCount() > 0;    
}


/*
 Returns whether the room specified room-name exists or not.
*/
function dbRoomExists($name) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT id FROM rooms WHERE name=:name' ); // TODO we can write >0 into sql
    $statement->execute(array(':name' => $name));
    
    return $statement->rowCount() > 0;    
}


/*
 Register a new account
*/
function dbAddAccount($name, $password, $email) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare(    
                    'INSERT INTO `accounts`(`name`, `password`, `email`)'.
                    'VALUES (:name, :password, :email)' );
                
    $ret = $statement->execute(array(':name' => $name, ':password' => $password, ':email' => $email));
                
    if($ret === TRUE) {
        // success
        // add default favorite rooms (entry)
        $userId = $dbh->lastInsertId();
        $statement = $dbh->prepare('INSERT INTO `favorite_rooms`(`account_id`, `room_id`) VALUES ('.$userId.',5)');
        $statement->execute();
    } else {
        print_r($dbh->errorInfo());
    }
    
    return $ret;
}


function dbGetNumberOfRooms() {
    $dbh = getDBH();
    $statement = $dbh->prepare('SELECT COUNT(*) FROM rooms');
    $statement->execute();
    return (int) $statement->fetch(PDO::FETCH_NUM);
}


function dbGetUserObject($name) {
    if(isset($GLOBALS['user_object'])) {
        return $GLOBALS['user_object']; 
    }
    
    $dbh = getDBH();
                
    $statement = $dbh->prepare('SELECT * FROM accounts WHERE name=:name');
    $statement->execute(array(':name' => $name));
    $user = $statement->fetch(PDO::FETCH_OBJ);
    
    $GLOBALS['user_object'] = $user;
    return $user;
}

function hlpCreateAccoutActivationCode($name, $email) {
    $hash = strrev(sha1(strrev($name) . 'itN5Io91i' . strrev($email)));
    return $hash;
}

function dbActivateAccount($name) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare("UPDATE `accounts` SET is_verified=1 WHERE name=:name");
    $statement->execute(array(':name' => $name));
}


function dbCreateEntryPasswordChangeRequests($email) {
    $dbh = getDBH();

    $id = sha1($email . "w8Q&TXfd!vx1D2{V<@%:b^^3a". microtime(true));
                
    $statement = $dbh->prepare("INSERT INTO `password_change_requests` (id, user_id) VALUES(:id, (SELECT id FROM `accounts` WHERE email=:email))");
    $statement->execute(array(':id' => $id, ':email' => $email));

    return $id;
}

function dbGetPasswordChangeRequest($id) {
    $dbh = getDBH();
                
    $statement = $dbh->prepare("SELECT * FROM `password_change_requests` WHERE id=:id");
    $statement->execute(array(':id' => $id));

    return $statement->fetch(PDO::FETCH_OBJ);
}

function dbConfirmPasswordChangeRequest($userId, $newPassword) {
    $dbh = getDBH();
    
    // update pass            
    $query = "UPDATE `accounts` SET password=:new_password WHERE id=:user_id";
    $statement = $dbh->prepare($query);
    $success = $statement->execute(array(':user_id' => $userId, ':new_password' => $newPassword));

    // delete link
    $query = "DELETE FROM `password_change_requests` WHERE user_id=:user_id";
    $statement = $dbh->prepare($query);
    $success = $statement->execute(array(':user_id' => $userId));
    

    return $success;
}


 function submitAccountActivationEmailPear($name, $to) {
        require_once "Mail.php";

        $verificationLink = "http://www.metahill.com/activate-account.php?name=" . $name . "&email=" . $to . "&code=" . hlpCreateAccoutActivationCode($name, $to);
        $body = file_get_contents("feature/verify_email.html");
        $body = str_replace("::name::", $name, $body);
        $body = str_replace("::verification_link::", $verificationLink, $body);

        $from     = "Metahill <welcome@metahill.com>";
        $subject  = "Activate your metahill account";
        //$body     = "";

        $host     = "ssl://smtp.gmail.com";
        $port     = "465";
        $username = "metahill_mail@jakob.tv";
        $password = '7!+/*f}<^Hjy+Ff[}}@>?.Dz8';

        $headers = array(
            'From'    => $from,
            'To'      => $to,
            'Subject' => $subject,
            'MIME-Version' => "1.0",
            'Content-type' => "text/html; charset=iso-8859-1"
        );
        $smtp = Mail::factory('smtp', array(
            'host'     => $host,
            'port'     => $port,
            'auth'     => true,
            'username' => $username,
            'password' => $password
        ));

        $mail = $smtp->send($to, $headers, $body);

        if (PEAR::isError($mail)) {
            var_dump($mail->getMessage());
            return false;
        } else {
            return true;
        }
    }



