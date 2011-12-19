Playsay.Guess = {
  init: function() {
    $('#guess_submit').click(Playsay.Guess.submitClicked);
    $('#new_guess').bind('ajax:success', Playsay.Guess.guessSubmitted);
  },

  guessSubmitted: function(event, response){
    if (response && response.guess) {
        if (response.guess.body) {
          if (response.guess.matched == true) {
            Playsay.handleMatched(response.guess.body);
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
  },

  submitClicked: function(event) {
    event.preventDefault();
    var guess = $('#guess_body').val();
    $('#guessMessage').empty().fadeOut(0);
    if ($.inArray(guess, Playsay.guesses) == -1) {
      if($('#guess_body').attr('data-lang')=="es")
        Playsay.Guess.translateGuessToSpanish();
      else
        Playsay.Guess.translateGuessToEnglish();
    } else {
      Playsay.handleAlreadyGuessed();
    }
  },

  translateGuessToSpanish: function() {
    var guess = $('#guess_body').val();
    Playsay.Guess.checkSpanish(guess);
  },

  translateGuessToEnglish: function() {
    var guess = $('#guess_body').val();
    Playsay.Guess.checkEnglish(guess);
  },

  checkSpanish: function(guess) {
    guess = encodeURIComponent(guess);
    var s = document.createElement("script");
    s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect?oncomplete=Playsay.Guess.spanishChecked&appId=" + appId + "&text=" + guess;
    document.getElementsByTagName("head")[0].appendChild(s);
  },

  checkEnglish: function(guess) {
    guess = encodeURIComponent(guess);
    var s = document.createElement("script");
    s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect?oncomplete=Playsay.Guess.englishChecked&appId=" + appId + "&text=" + guess;
    document.getElementsByTagName("head")[0].appendChild(s);
  },

  spanishChecked: function(response) {
    if (response == "es") {
      var guess = $('#guess_body').val();
      $('#previousGuesses').prepend('<li>' + guess + '</li>');
      var s = document.createElement("script");
      s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=Playsay.Guess.guessTranslated&appId=" + appId +
          "&from=es&to=en&text=" + guess;
      document.getElementsByTagName("head")[0].appendChild(s);
      $('#guess_body').val('');
      Playsay.guesses.push(guess);
    }
    else {
      Playsay.handleNotSpanish();
    }
  },

  englishChecked: function(response) {
    if (response == "en") {
      var guess = $('#guess_body').val();
      $('#previousGuesses').prepend('<li>' + guess + '</li>');
      var s = document.createElement("script");
      s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=Playsay.Guess.guessTranslated&appId=" + appId +
          "&from=es&to=en&text=" + guess;
      document.getElementsByTagName("head")[0].appendChild(s);
      $('#guess_body').val('');
      Playsay.guesses.push(guess);
    }
    else {
      Playsay.handleNotEnglish();
    }
  },

  guessTranslated: function(response) {
    $('#guess_body').val(response);
    $('#new_guess').submit();
    $('#guess_body').val('');
  }
};