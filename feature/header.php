<header>
    <a href="../../../../../../../../"><img id="company-icon" alt="metahill icon" src="http://www.metahill.com/img/metahill.png" /></a>

        
    <?php
        if(isset($_SESSION['name']) && isset($_SESSION['password']) && isset($_SESSION['verified']) && isset($_SESSION['logged_in']) && strpos($_SERVER['PHP_SELF'], 'index.php') !== false) {
            $name = $_SESSION['name'];
            require_once('php/db-interface.php');
            $user = dbGetUserObject($name);
            $userId = $user->id;

            $imagePath;
            if($user->image != NULL) {
                $imagePath = 'avatars/' . $user->image;
            } else {
                $imagePath = 'img/default-avatar.png';
            }
            
            echo '<div class="menu">
                    <div id="site-status" class="alert">
                        Some status message here
                    </div>';

            // avatar
            echo "<div id='user-avatar'><img src='$imagePath' alt='user avatar' /></div>";
            echo "<span id='user-id' style='display:none;'>$userId</span>";
            
            // user
            echo '<div id="userbar">
                    <div class="btn-group" id="user-name">
                        <button class="btn dropdown-toggle" data-toggle="dropdown">'. $name .'&nbsp;<span class="caret"></span></button>
                        <ul class="dropdown-menu pull-right">
                          <li><a href="#modal-pref" data-toggle="modal">Preferences</a></li>
                          <li><a href="#modal-profile" data-toggle="modal">Profile</a></li>
                          <li class="divider"></li>
                          <li><a href="logout.php">Sign out</a></li>
                        </ul>
                      </div>
                      <button id="help-button" class="btn">Help</button>
                    </div>
                  </div>';

        }
    ?>
    
</header>