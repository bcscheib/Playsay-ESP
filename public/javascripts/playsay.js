var Playsay = {
  init: function() {
    $('#login_link').click(function() {
      FB.login(function(response) {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
//            console.log('Good to see you, ' + response.name + '.');
//            FB.logout(function(response) {
//              console.log('Logged out.');
//            });
            var user_id = response.id;
            console.log('user id: ', user_id);
            var query = FB.Data.query('select src from photo where uid={0}',
                user_id);
            query.wait(function(rows) {
              console.log("results: ", rows);
            });
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'email, photos'});
    });
  }
};