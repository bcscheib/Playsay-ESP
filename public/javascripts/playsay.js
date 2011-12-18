var Playsay = {
  getQueryValue: function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  init: function() {
    $('#login_link').click(Playsay.onClickLoginLink);
//    var facebookId = Playsay.getQueryValue('fb'); // hacked
//    Playsay.createUser(facebookId);
  },

  onClickLoginLink: function() {
    console.log("clicked");
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
          console.log("me");
//            console.log('Good to see you, ' + response.name + '.');
//            FB.logout(function(response) {
//              console.log('Logged out.');
//            });
          var facebookId = response.id;
          Playsay.createUser(facebookId);
//            console.log('user id: ', user_id);
//            var query = FB.Data.query('select src from photo where uid={0}',
//                user_id);
//            query.wait(function(rows) {
//              console.log("results: ", rows);
//            });
        });
      } else {
//          console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'email'});
  },

  createUser: function(facebookId) {
    $('#user_facebook_id').val(facebookId);
    $('#new_user').bind('ajax:success', function(event, response) {
      if (response && response.user && response.user.id)
        window.location = '/start';
    });
    $('form#new_user').submit();
  },

  initStartPage: function() {
    $(document).ready(function() {
      Playsay.initPairUser();
      Playsay.initGuessBox();
    });
  },

  initGuessBox: function() {
    $('#new_guess').bind('ajax:success', function(event, response) {
      if (response && response.guess) {
        if (response.guess.body) {
          $('#previousGuesses').append('<li>' + response.guess.body + '</li>')
          if (response.guess.matched == true) {
            alert("You matched on " + response.guess.matched);
            window.location = "/start";
          }
        }
        else {
          alert("Your pair passed on this photo");
          window.location = "/start";
        }
      }
      else {
        // some kind of error
      }
    });
  },

  initPairUser: function() {
    $('.edit_user').bind('ajax:success', function(event, response) {
      console.log(response);
      if (response && response.user.paired_user_id) // there is a paired user
      {
        $('#pairedUser').html(response.user.id);
        $('#guessesContainer').show();
      }
      else {
        $('#pairedUser').html("(not paired yet)");
        $('#guessesContainer').hide();
        $('#user_force_unpair').val('0');
        setTimeout(Playsay.pairUser, 500);
      }
    });
    $('#pass_link').click(function() {
      console.log("clicked");
      $('#user_force_unpair').val('1');
      Playsay.pairUser();
    });
    Playsay.pairUser();
  },

  pairUser: function() {
    $(".edit_user").submit();
  }
};