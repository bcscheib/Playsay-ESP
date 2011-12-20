Playsay.Guess = {
  init: function() {
    $('#guess_submit').click(Playsay.Guess.submitClicked);
    $('#new_guess').bind('ajax:success', Playsay.Guess.guessSubmitted);
  },

  guessSubmitted: function(event, response) {
    if (response && response.guess) {
      if ((response.guess && response.guess.matched == true) || (response.last_guess && response.last_guess.matched == true)) {
        var matchedText = '';
        if (response.guess && response.guess.matched == true)
          matchedText = response.guess.body;
        else
          matchedText = response.last_guess.body;

        if ($.inArray(matchedText.toLowerCase(), Playsay.guesses) != -1)
          Playsay.handleMatched(matchedText);
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

    if ($('#guess_body').attr('data-lang') == "es")
      Playsay.Guess.translateGuessToSpanish();
    else
      Playsay.Guess.translateGuessToEnglish();
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
      if (guess != '') {
        $('#previousGuesses').prepend('<li>' + guess + '</li>');
        var s = document.createElement("script");
        s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=Playsay.Guess.guessTranslated&appId=" + appId +
            "&from=es&to=en&text=" + guess;
        document.getElementsByTagName("head")[0].appendChild(s);
        $('#guess_body').val('');
      }
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
    }
    else {
      Playsay.handleNotEnglish();
    }
  },

  guessTranslated: function(response) {
    if ($('#taboos').html().indexOf(response.toLowerCase()) == -1) {
      if ($.inArray(response.toLowerCase(), Playsay.guesses) == -1) {
        Playsay.guesses.push(response.toLowerCase());
        $('#guess_body').val(response);
        $('#new_guess').submit();
      } else {
        $('#previousGuesses li:first').remove();
        Playsay.handleAlreadyGuessed();
      }
    } else {
      $('#previousGuesses li:first').remove();
      if (response != '')
        Playsay.handleTabooWord();
    }
    $('#guess_body').val('');
  }
};