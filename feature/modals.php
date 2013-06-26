<link rel="stylesheet" type="text/css" href="css/modals.css">

<div id="modal-pref" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3>Preferences</h3>
    </div>
    <div class="modal-body">
        <h3>Favorite rooms</h3>
        <p class="pref-desc">Favorite rooms are joined when you log in.<br />
                             Drag rooms from right to left to add favorites.</p>
         <div id="pref-select-favorite-channels">
            <div>
                <span>Favorite rooms</span>
                <ul id="modal-pref-favorite-rooms" class="connectedSortable">
                    <?php
                        foreach($rooms as $room) {
                            $name = $room->name;
                            $id = $room->id;
                            echo "<li class='room-favorite ui-bootstrap-list-item btn' data-roomid='$id'>$name</li>";
                        }
                    ?>
                </ul>
            </div>
             
            <div>
                <input type="text" id="pref-select-favorite-channels-search" placeholder="Search room">
                <ul id="modal-pref-nonfavorite-rooms" class="connectedSortable">
                </ul>
            </div>
        </div>
        <h3>Messaging</h3>
        <table id="modals-pref-table">
            <tr>
                <td>
                    <span>Chat text size</span>
                </td>
                <td>
                    <select id="modals-pref-textsize" class="selectpicker">
                        <?php
                            $fontSizes = array(10, 11, 12, 13, 14, 18);
                            $userChatTextSize = $user->chat_text_size;
                            $text = '';
                            for($i = 0; $i < count($fontSizes); ++$i) {
                                $size = $fontSizes[$i];
                                $attr = '';
                                if($size == $userChatTextSize) {
                                    $attr = 'selected="selected"';
                                }
                                $text .= "<option value='$size' $attr>$size pt</option>";
                            }
                            echo $text;
                        ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <span>Font</span>
                </td>
                <td>
                    <select id="modals-pref-font" class="selectpicker">
                        <?php
                            $fonts = array('Helvetica', 'Noto Sans', 'Noto Serif', 'Courier New');
                            for($i=0; $i<count($fonts); ++$i) {
                                $font = $fonts[$i];
                                $attr = '';
                                if($font == $user->chat_text_font) {
                                    $attr = 'selected';
                                }
                                echo "<option value='$font' $attr>$font</option>";
                            }
                        ?>
                    </select>
                </td>
            </tr>
        </table>
        <label class="checkbox">
            <input id="modals-pref-enable-smilies" type="checkbox" <?php if($user->enable_smilies) { echo 'checked="checked"'; } ?> value="enable_smilies" />Enable smilies
        </label>
        <label class="checkbox">
            <input id="modals-pref-enable-formatting" type="checkbox" <?php if($user->enable_formatting) { echo 'checked="checked"'; } ?> value="enable_formatting" />Enable formatting (<b>**bold**</b>, <i>_italics_</i>, <i>*italics*</i>, <code>`code`</code>)
        </label>
        <label class="checkbox">
            <input id="modals-pref-enable-notification-sounds" type="checkbox" <?php if($user->enable_notification_sounds) { echo 'checked="checked"'; } ?> value="enable_notification_sounds" />Notification sounds
        </label>
        <label class="checkbox">
            <input id="modals-pref-chat-show-traffic" type="checkbox" <?php if($user->chat_show_traffic) { echo 'checked="checked"'; } ?> value="enable_notification_sounds" />Show user joins and quits
        </label>
        <br>
        <h3>Other</h3>
        <label class="checkbox">
            <input id="modals-pref-enable-tips" type="checkbox" <?php if($user->enable_tips) { echo 'checked="checked"'; } ?> value="enable_tips" />Show tips and news at the top
        </label>
        
    </div><!-- end body -->
    <div class="modal-footer">
        <button id="modal-pref-submit" class="btn btn-primary">Okay</button>
    </div>
</div><!-- end preferences -->

    
<div id="modal-profile" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h3>Profile</h3>
    </div>
    <div class="modal-body">
    
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        
    </div><!-- end body -->
    <div class="modal-footer">
        <button id="modal-profile-submit" class="btn btn-primary">Okay</button>
    </div>
</div><!-- end profile -->


<div id="modal-new-room" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h3>Create new room</h3>
    </div>
    <div class="modal-body">
        <p>You can create rooms at any time you wish and it is very uncomplicated.</p>
        <br>
        <label class="checkbox">
            <p>Roomname</p><input id="modals-new-room-name" type="text" pattern=".{3, 30}" title="3 to 30 characters" />
        </label>
        <label class="checkbox">
            <p>Roomtopic</p><textarea id="modals-new-room-topic" maxlength="500"></textarea>
        </label>
        
    </div><!-- end body -->
    <div class="modal-footer">
        <button id="modal-new-room-submit" class="btn btn-primary">Create room</button>
    </div>
</div><!-- end new room -->
