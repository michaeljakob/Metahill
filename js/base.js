/**
 * File included by -all- main php files.
 */

var metahill = metahill || {};
metahill.base = {};
metahill.base.support = {};
metahill.base.user = {};
metahill.base.user.that = {};

/**
 * metahill.base
 */
$(function() {
    metahill.base.isWindowFocused = true;

    var originalDocumentTitle = document.title;

    function updateIsFocussedState(_) {
        metahill.base.isWindowFocused = true;
        
        if(metahill.log !== undefined && metahill.log.unseenMessages !== undefined && metahill.log.unseenMessages !== 0) {
            document.title = originalDocumentTitle;
            metahill.log.unseenMessages = 0;
        }
    }

    
    $('body').click(updateIsFocussedState);
    $(window).focus(updateIsFocussedState);

    $(window).blur(function() {
        metahill.base.isWindowFocused = false;
    });
});

/**
 * metahill.base.support
 */
$(function() {
    var toLowerUserAgent = navigator.userAgent.toLowerCase();

    // browsers
    metahill.base.support.isChrome = toLowerUserAgent.indexOf('chrome') > -1;
    metahill.base.support.isOpera = toLowerUserAgent.indexOf('opera') > -1;
    metahill.base.support.isFirefox = toLowerUserAgent.indexOf('firefox') > -1;
    metahill.base.support.isInternetExplorer = toLowerUserAgent.indexOf('microsoft') > -1 || toLowerUserAgent.indexOf('msie') > -1;

    // operating systems
    metahill.base.support.isMac = navigator.platform.toLowerCase().indexOf('mac') > -1;
    metahill.base.support.isWindows = navigator.appVersion.indexOf('win') > -1;

    // devices
    metahill.base.support.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    // functionality
    metahill.base.support.isAnimated = metahill.base.support.isChrome || metahill.base.support.isFirefox || metahill.base.support.isOpera;
    metahill.base.support.isEmbedded = window.location.pathname.indexOf('embedded.php') > -1;

    if(metahill.base.support.isInternetExplorer && window.location.pathname.indexOf('get-a-modern-browser.php') === -1) {
        window.location = 'http://www.metahill.com/get-a-modern-browser.php';
    }
});

$(function() {
    var adminNames = ['Michael'];
    var modNames = ['maxi'];

    metahill.base.user.isAdmin = function(userName) {
        return adminNames.indexOf(userName) !== -1;
    };

    metahill.base.user.isMod = function(userName) {
        return modNames.indexOf(userName) !== -1;
    };

    /**
     * Checks if a given user is an admin of the given room.
     * @param  {[type]}  $room    [description]
     * @param  {[type]}  userName [description]
     * @return {Boolean}          [description]
     */
    metahill.base.user.isRoomAdmin = function($room, userName) {
        var attendeeId = $('#channel-attendees-entries li:contains("'+userName+'")').attr('id');
        if(attendeeId === undefined) {
            return false;
        }
        
        var userId = attendeeId.substring(attendeeId.lastIndexOf('-') + 1);

        return $room.attr('data-owner').split(',').indexOf(userId) > -1;
    };

    /*
        Checks whether this user is the owner of the active room.
     */
    metahill.base.user.that.isActiveRoomAdmin = function() {
        return metahill.base.user.that.isRoomAdmin(metahill.main.activeRoom);
    };

    metahill.base.user.that.isRoomAdmin = function($room) {
        return $room.attr('data-owner').split(',').indexOf(metahill.main.userId) > -1;
    };

    /**
     * Checks whether this user's rank is higher than the
     * one of the other user provided.
     * The speciality is, that true is returned if
     * - both are admins
     * - both are mods
     * and false is returned if
     * - both are normal users
     * This is legitimated by assuming that admins may do anything to other admins (same for mods),
     * but a user may not reign over another user. This prevents trolling. :)
     * @param  {string} other Username of the other user
     * @return {bool}   
     */
    metahill.base.user.that.mayReignOver = function(other) {
        var that = metahill.main.userName;
        if(that === other) {
            return false;
        }

        if(metahill.base.user.isAdmin(that))
            return true;

        if(metahill.base.user.isAdmin(other))
            return false;

        if(metahill.base.user.isMod(that))
            return true;

        if(metahill.base.user.isMod(other))
            return false;

        if(metahill.base.user.that.isActiveRoomAdmin())
            return true;

        return false;
    };
});






