var mongoose = require('mongoose');

var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = mongoose.model('User');

// load the auth variables
var configAuth = require('config');

module.exports = new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebookid' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.email = profile.emails[0].value;
                    newUser.username = profile.name.givenName + ' ' + profile.name.familyName;   
                    newUser.photo =  profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg';
                    newUser.facebookid = profile.id;
                    newUser.isadmin= false;
                    newUser.isbanned=false;
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        });
    }
);
