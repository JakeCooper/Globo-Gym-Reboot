var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var config = require('config');

var google = require('./google');
/**
 * Expose
 */

module.exports = function (passport, app) {
    // serialize sessions
    passport.serializeUser(function(user, done) {
         done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
          User.load({ criteria: { _id: id } }, function (err, user) {
              done(err, user)
          })
    })
    passport.use(google);

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    // routes for google authentication
    app.get('/auth/google',
        passport.authenticate('google', { scope: config.google.loginURL })
    );

    app.get('/oauth2callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
        // Successful authentication, redirect home.
            res.redirect('/');
        }
    );

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    })
};
