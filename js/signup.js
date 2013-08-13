/// jshint settings
/*global $ */

$(function() {
  var totalStatus = [false, false, false]; /* email, name, password */
  
  var reg_name = $('#reg_name');
  var reg_email = $('#reg_email');
  var reg_password = $('#reg_password');
  
  reg_email.bind('propertychange keyup input paste', emailVerifier);
  reg_name.bind('propertychange keyup input paste', nameVerifier);
  reg_password.bind('propertychange keyup input paste', passwordVerifier);
  
  $(document).ready(function() {
    $(window).resize();
  });

  $("#action-chooser").submit(function() {
    return isSubmitAvailable();
  });

  function isSubmitAvailable() {
    var nameLenOk = $.trim(reg_name.val()).length > 0;
    var passwordLenOk = $.trim(reg_password.val()).length > 0;
    var emailLenOk = $.trim(reg_email.val()).length > 0;

    if(window.location.pathname.indexOf('signup-with-facebook.php') !== -1) {
      return nameLenOk && passwordLenOk && totalStatus[1] && totalStatus[2];
    } else {
      return nameLenOk && passwordLenOk && emailLenOk && totalStatus[0] && totalStatus[1] && totalStatus[2];
    }
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
      } else if(name.length > 12){
        status.removeClass('label-success');
        status.addClass('label-alert');
        status.text("Your name should be no longer than 12 characters.");
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
      if($(this).val().trim().length < 8) {
        status.removeClass('label-success');
        status.addClass('label-alert');
        status.text("Your password should be at least 8 characters.");
        totalStatus[2] = false;
      } else if($(this).val().trim().length > 30){
        status.removeClass('label-success');
        status.addClass('label-alert');
        status.text("Your password should be no longer than 30 characters.");
        totalStatus[2] = false;
      } else {
        status.removeClass('label-alert');
        status.addClass('label-success');
        status.text("Alrighty.");
        totalStatus[2] = true;
      }
      updateSubmitButton();
    }
    
    var isEmailValid = function() {        
      var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9]){1,})+$/;
      
      return function(email) {
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
          };
        }();
        
        function containsBannedEmailString(email) {
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
            if(parseInt(exists,10)===1 && name === inputText.val()) {
              status.removeClass('label-success');
              status.addClass('label-alert');
              status.text('This username already exists :[');
              totalStatus[1] = false;
              updateSubmitButton();
            }
          }
          var json = { 'username': name };
          var result = metahill.helper.submitHttpRequest('does-username-exist.php', json, callback);
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



