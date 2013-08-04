<header>
    <a href="http://www.metahill.com"><img id="company-icon" alt="metahill icon" src="http://www.metahill.com/img/metahill.png" /></a>


    <?php
        if( isset($_SESSION['name']) && 
            isset($_SESSION['verified']) && 
            isset($_SESSION['logged_in']) && 
            strpos($_SERVER['PHP_SELF'], 'index.php') !== false) {


            if(!$user->is_guest) {
                echo "<div class='menu'>";
                echo     "<div id='site-status' class='alert'>";
                echo "</div>";
            }


            echo "<div id='user-id' style='display:none;'>{$user->id}</div>";

            // user
            $name = $user->name;
            echo "<div id='userbar'>";
                echo "<div class='btn-group' id='user-name'>";
                        echo   "<button class='btn dropdown-toggle' data-toggle='dropdown'>". $name ."&nbsp;<span class='caret'></span></button>";
                        echo   "<ul class='dropdown-menu pull-right'>";
                        if($user->is_guest) {
                            echo "<li><a target='_blank' href='signup.php'>Register</a></li>";
                        }
                        if(!$user->is_guest) {
                            echo  "<li><a href='#modal-pref' data-toggle='modal'>Preferences</a></li>";
                            echo  "<li><a href='#modal-profile' data-toggle='modal'>Profile</a></li>";
                        }
                        echo        "<li class='divider'></li>";
                        echo        "<li><a href='help' target='_blank'>Help</a></li>";
                        echo        "<li><a href='blog' target='_blank'>Blog</a></li>";
                        echo        "<li class='divider'></li>";
                        echo        "<li><a href='logout.php'>Sign out</a></li>";
                        echo    "</ul>";
                echo "</div>"; // #user-name
            echo "</div>"; // #userbar
        } 
    ?>

</header>