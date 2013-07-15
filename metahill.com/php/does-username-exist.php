<?php

require_once('db-interface.php');
$dbh = getDBH();

$name = $_POST['username'];

if(dbUserNameExists($name)) {
    header('Content-Description: 1');
} else {
    header('Content-Description: 0');
}











