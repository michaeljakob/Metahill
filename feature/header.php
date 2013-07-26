<header>
    <a href="http://www.metahill.com"><img id="company-icon" alt="metahill icon" src="http://www.metahill.com/img/metahill.png" /></a>

        
    <?php
        if(isset($_SESSION['name']) && isset($_SESSION['verified']) && isset($_SESSION['logged_in']) && strpos($_SERVER['PHP_SELF'], 'index.php') !== false) {
            $name = $_SESSION['name'];
            // $user already set in index.php
            $userId = $user->id;
            
            echo '<div class="menu">
                    <div id="site-status" class="alert">
                        Some status message here
                    </div>';

            // avatar
            echo "<div id='user-id' style='display:none;'>$userId</div>";
            
            // user
            echo '<div id="userbar">
                    <div class="btn-group" id="user-name">
                        <button class="btn dropdown-toggle" data-toggle="dropdown">'. $name .'&nbsp;<span class="caret"></span></button>
                        <ul class="dropdown-menu pull-right">
                          <li><a href="#modal-pref" data-toggle="modal">Preferences</a></li>
                          <li><a href="#modal-profile" data-toggle="modal">Profile</a></li>
                          <li><a href="help" target="_blank">Help</a></li>
                          <li><a href="forum" target="_blank">Forum</a></li>
                          <li class="divider"></li>
                          <li><a href="logout.php">Sign out</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>';

        }
    ?>
    
</header>