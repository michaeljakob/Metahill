/// jshint settings
/*global $ */

$(function() {
    
    var totalStatus = [false, false, false];
    
    var reg_name = $('#reg_name');
    var reg_email = $('#reg_email');
    var reg_password = $('#reg_password');
    
    reg_email.keyup(emailVerifier);
    reg_name.keyup(nameVerifier);
    reg_password.keyup(passwordVerifier);
    
    $(document).ready(function() {
        $(window).resize();
    });

    $("#action-chooser").submit(function() {
        return isSubmitAvailable();
    });

    function isSubmitAvailable() {
        return $.trim(reg_name.val()).length > 0 && $.trim(reg_email.val()).length > 0 && $.trim(reg_password.val()).length > 0 && totalStatus[0] && totalStatus[1] && totalStatus[2];
    }

    function updateSubmitButton() {
        if(isSubmitAvailable()) {
            $(':submit').removeAttr('disabled');
        } else {
            $(':submit').prop('disabled', true);
        }
    }


    function emailVerifier(_) {
        var status = $(this).next();
        if(isEmailValid($(this).val())) {
            status.removeClass('label-alert');
            status.addClass('label-success');
            status.text("This email works!");
            totalStatus[0] = true;
        } else {
            status.removeClass('label-success');
            status.addClass('label-alert');
            status.text("This does not look quite right :(");
            totalStatus[0] = false;
        }
        updateSubmitButton();
    }

    
    function nameVerifier(_) {
        var status = $(this).next();
        var name = $(this).val().trim();
        if(name.length < 3) {
            status.removeClass('label-success');
            status.addClass('label-alert');
            status.text("Your name should be at least 3 characters.");
            totalStatus[1] = false;
        } else if(name.length > 20){
            status.removeClass('label-success');
            status.addClass('label-alert');
            status.text("Your name should be no longer than 20 characters.");
            totalStatus[1] = false;
        } else if(name.indexOf('@') !== -1) {
            status.removeClass('label-success');
            status.addClass('label-alert');
            status.text("Please do not use the @-sign.");
            totalStatus[1] = false;
        } else {
            doesUsernameExist(name, $(this), status);
            status.removeClass('label-alert');
            status.addClass('label-success');
            status.text("Seems legit.");
            totalStatus[1] = true;
        }
        updateSubmitButton();
    }
    
    function passwordVerifier(_) {
        var status = $(this).next();
        if($(this).val().trim().length >=8) {
            status.removeClass('label-alert');
            status.addClass('label-success');
            status.text("Alrighty.");
            totalStatus[2] = true;
        } else {
            status.removeClass('label-success');
            status.addClass('label-alert');
            status.text("Your password should be at least 8 characters.");
            totalStatus[2] = false;
        }
        updateSubmitButton();
    }
    
    function isEmailValid(email) {        
        var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9]){1,})+$/;
        
        return function() {
            if(email.length>254) {
                return false;
            }
                
            var valid = tester.test(email);
            if(!valid) {
                return false;
            }
                            
            if(containsBannedEmailString(email)) {
                return false;
            } 
        
            // Further checking of some things regex can't handle
            var parts = email.split("@");
            if(parts[0].length>64) {
                return false;
            }
        
            var domainParts = parts[1].split('.');
            if(domainParts.some(function(part) { return part.length>63; })) {
                return false;
            }
        
            return true;
        }();
    }
    
    function containsBannedEmailString(email) {
        return false;
        var banned = [  '@trash-mail', '@10minutemail', '@cjpeg', '@rmqkr', '@zehnminutenmail', 
                        '@meltmail', '@mailinator', 'spam4', '@guerillamail', '@sharklasers', 
                        'mailexpire', '@tempemail'];
        
        email = email.toLowerCase();
        for(var i=0; i<banned.length; ++i) {
            if(email.indexOf(banned[i]) !== -1) {
                return true;
            }
        }
        
        return false;
    }

    /*
        Checks asynchronously whether the given username exist or not and does
        update the status text depending upon that.
    */
    function doesUsernameExist(name, inputText, status) {
        function callback(exists) {
            if(exists && name === inputText.val()) {
                status.removeClass('label-success');
                status.addClass('label-alert');
                status.text("This username already exists :[");
                totalStatus[1] = false;
            }
        }
        var json = { 'username': name };
        var result = submitHttpRequest('does-username-exist.php', json, callback);
    }

    function submitHttpRequest(phpFile, json, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/' + phpFile);

        xhr.onload = function () {
            if (xhr.status === 200) {
                var result = xhr.getResponseHeader('Content-Description');
                callback(result === "1");
            } else {
                var error = xhr.getResponseHeader('Content-Description');
                console.log('http request: something went terribly wrong('+error+'), ' + xhr.status  + ':' + xhr.statusText);
            }
        };

        var formData = new FormData();
        formData.append('user_id', $('#user-id').text());
        for(var key in json) {
            formData.append(key, json[key]);
        }

        xhr.send(formData);
    }
    
    $(window).resize(function() {
        var h = $(window).height();
        if(h < 685) {
            $('footer').css('bottom', h - 635);
        } else {
            $('footer').css('bottom', '50px');
        }
    });
});



