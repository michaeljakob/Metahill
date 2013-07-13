<link rel="stylesheet" type="text/css" href="css/modals.css">

<div id="modal-pref" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h3>Preferences</h3>
    </div>
    <div class="modal-body">
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
                            $fonts = array('Helvetica', 'Verdana', 'Times New Roman', 'Lucida Console', 'Courier New');
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
            <input id="modals-pref-enable-formatting" type="checkbox" <?php if($user->enable_formatting) { echo 'checked="checked"'; } ?> value="enable_formatting" />Enable formatting (<b>*bold*</b>, <i>_italics_</i>, <code>`code`</code>)
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
        <button id="modal-pref-submit" class="btn btn-info">Save</button>
    </div>
</div><!-- end preferences -->

    
<div id="modal-profile" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h3>Profile</h3>
    </div>
    <div class="modal-body">
        <h3>Change your password</h3>
        <p class="heading-desc">Use between 8 and 30 characters.</p>
        <label>
            <input id="modals-profile-new-password" type="password" pattern=".{8,30}" placeholder="Your new password" />
        </label>
        <h3>I forgot my password</h3>
        <p>No worries, you can request a new password <a href="request-new-password.php">here</a>.</p>
        <h3>Delete account</h3>
        <label class="checkbox">
            Delete your account and all associated information.
            <input id="modals-profile-delete" type="checkbox" />
        </label>
    </div><!-- end body -->
    <div class="modal-footer">
        <button id="modals-profile-current-password-info" class="btn">?</button>
        <input id="modals-profile-current-password" class="modals-current-password" required type="password" pattern=".{8,30}" placeholder="Your current password" />
        <button id="modal-profile-submit" disabled class="btn btn-info">Save</button>
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
            <p>Roomname<span class="heading-desc">Use between 3 and 20 characters</span></p>
            <input id="modals-new-room-name" type="text" required pattern="[a-zA-Z0-9\-_+]{3,20}" placeholder="A short and meaningful name" />
            <span id="modals-new-room-name-status" class="label label-warning" style="display:none;">This room already exists.</span>
        </label>
        <label class="checkbox">
            <p>Roomtopic<span class="heading-desc">Use between 20 and 200 characters</span></p>
            <textarea id="modals-new-room-topic" maxlength="200" spellcheck placeholder="A short description of what this room is about. Try to be expressive and use strong keywords."></textarea>
        </label>
        
    </div><!-- end body -->
    <div class="modal-footer">
        <button id="modal-new-room-submit" class="btn btn-info" disabled>Create room</button>
    </div>
</div><!-- end new room -->


<div id="modal-room-pref" class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h3> room preferences</h3>
    </div>
    <div class="modal-body">
        <h3>Change topic</h3>
        <p>Describe in easy and clear words what this room is about. You can add links to FAQs or other references.</p>
        <label class="checkbox">
            <span class="heading-desc-large">Use between 20 and 200 characters</span>
            <textarea id="modals-room-pref-topic" maxlength="200" spellcheck placeholder="A short description of what this room is about. Try to be expressive and use strong keywords."></textarea>
        </label>
        
        <h3>Delete room</h3>
            We got this! Unused rooms are automatically deleted after a while.
    </div><!-- end body -->
    <div class="modal-footer">
        <button id="modals-room-pref-current-password-info" class="btn">?</button>
        <input id="modals-room-pref-current-password" class="modals-current-password" required type="password" pattern=".{8,30}" placeholder="Your current password" />
        <button id="modal-room-pref-submit" class="btn btn-info" disabled>Save</button>
    </div>
</div><!-- end new room -->
























