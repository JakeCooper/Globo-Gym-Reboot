var mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('config');
var User = mongoose.model('User');

module.exports = new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
    }, function(accessToken, refreshToken, profile, done) {

        var options = {
            'googleid': profile.id
        };
        var update = {
            photo: profile.photos[0].value,
            username: profile.displayName,
            googleid: profile.id
        }

        User.findOneAndUpdate( options, update, function (err, user) {
            if (err) return done(err);
            return done(err, user);
        });
    }
);
