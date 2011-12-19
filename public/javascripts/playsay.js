var Playsay = {
  facebookId: null,
  name: null,
  guesses: [],
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
//    var name = Playsay.getQueryValue('name'); // hacked
//    Playsay.createUser(facebookId, name);
    if(window.location.toString().indexOf('start')!=-1)
      Playsay.initStartPage();
  },

  onClickLoginLink: function() {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
          Playsay.facebookId = response.id;
          Playsay.name = response.name;
          Playsay.createUser(Playsay.facebookId, Playsay.name);
        });
      } else {
//          console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'email, user_photos'});
  },

  getPhotos: function() {
//    var query = FB.Data.query('select src from photo where uid={0}', Playsay.facebookId);
//    console.log(query);
//    query.wait(function(rows) {
//      console.log("results: ", rows);
//    });
  },

  createUser: function(facebookId, name) {
    $('#user_facebook_id').val(facebookId);
    $('#user_name').val(name);
    $('#new_user').bind('ajax:success', function(event, response) {
      if (response && response.user && response.user.id)
        window.location = '/start';
    });
    $('form#new_user').submit();
  },

  initStartPage: function() {
      Playsay.initPairUser();
      Playsay.Guess.init();
      Playsay.getPhotos();
      $(document).ready(function(){
        $('#photoContainer img').width($('#photoContainer').outerWidth());
      });
  },

  handleAlreadyGuessed: function() {
    $('#guessMessage').fadeIn();
    $('#guessMessage').html('You already guessed that.');
    $('#guessMessage').fadeOut(3000);
    $('#guess_body').val('');
  },

  handleMatched: function(guess) {
    $('#guessMessage').fadeIn();
    $('#guessMessage').html('You matched on ' + guess + '.');
    $('#guess_body').val('');
    setTimeout(Playsay.refresh, 2000);
  },

  handleNotSpanish: function(guess) {
    $('#guessMessage').fadeIn();
    $('#guessMessage').html('You have to guess in spanish! English is not accepted.');
    $('#guess_body').val('');
  },

  handleNotEnglish: function(guess) {
    $('#guessMessage').fadeIn();
    $('#guessMessage').html('You have to guess in English! No other language is accepted.');
    $('#guess_body').val('');
  },

  initPairUser: function() {
    $('.edit_user').bind('ajax:success', function(event, response) {
      console.log(response);
      if (response && response.user.paired_user_id) // there is a paired user
      {
        $('#pairedUser').html(response.user.name);
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

  refresh: function() {
    window.location = "/start";
  }
};