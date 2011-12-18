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
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
//            console.log('Good to see you, ' + response.name + '.');
//            FB.logout(function(response) {
//              console.log('Logged out.');
//            });
          console.log(response);
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
    $('#guess_submit').click(function(event) {
      event.preventDefault();
      Playsay.translateGuess();
      $('#previousGuesses').append('<li>' + $('#guess_body').val() + '</li>')
      $('#guess_body').val('');
    });

    $('#new_guess').bind('ajax:success', function(event, response) {
      if (response && response.guess) {
        if (response.guess.body) {
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
        if (response.user.guess_language == 'en') {
          $('#guess_body_label').html('You must guess in Spanish');
          $('#guess_body').attr('data-lang', 'es');
        }
        else {
          $('#guess_body_label').html('You must guess in English');
          $('#guess_body').attr('data-lang', 'en');
        }
      }
      else {
        $('#pairedUser').html("(not paired yet)");
        $('#guessesContainer').hide();
        $('#user_force_unpair').val('0');
        setTimeout(Playsay.pairUser, 500);
      }
    });
    $('#pass_link').click(Playsay.onClickPassLink);
    Playsay.pairUser();
  },

  pairUser: function() {
    $(".edit_user").submit();
  },

  onClickPassLink: function() {
    $('#user_force_unpair').val('1');
    Playsay.pairUser();
  },

  translateGuess: function() {
    var guess = $('#guess_body').val();
    // make call to api here
    var s = document.createElement("script");
    s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=Playsay.guessTranslated&appId=" + appId +
            "&from=es&to=en&text=" + guess;
    document.getElementsByTagName("head")[0].appendChild(s);
  },

  guessTranslated: function(response){
     $('#guess_body').val(response);
     $('#new_guess').submit();
     $('#guess_body').val('');
  }
};