
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var config = require('config');




// expose this function to our app using module.exports
module.exports = new LocalStrategy(
    
    {
    
    usernameField: 'username',
    passwordField: 'adminpassword',
    
        
    
    },
    function(username,adminpassword,done){
  // insert your MongoDB check here. For now, just a simple hardcoded check.
  if (username === 'admin' && adminpassword === 'admin')
  {
    done(null,{ user: username });
  }
  else
  {
    done(null, false);
  }
});

    
    
    /*
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
    function (req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
            return done(err);

            // if no user is found, return the message
            if (!user)
            
                return done(null, false); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }
);
*/

