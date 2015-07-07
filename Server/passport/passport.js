var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = mongoose.model('User');
var config = require('config');

var google = require('./google');
var facebook = require('./facebook');

module.exports = function (passport, app) {
    // serialize sessions
    passport.serializeUser(function(user, done) {
         done(null, user.id)
    })

    passport.deserializeUser(function(id, done) {
          User.deserializeUser(id, done)
    })

    passport.use(google);
    passport.use(facebook); //?? will this work tho

    app.use(passport.initialize());
    app.use(passport.session());

    // we shoud probably put everything from here down into another folder

    // routes for google authentication
    app.get('/auth/google',
        passport.authenticate('google', { scope: config.google.loginURL })
    );

    app.get('/oauth2callback',
        passport.authenticate('google', { failureRedirect: '/app/signin' }),
        function(req, res) {
        // Successful authentication, redirect home.
            res.redirect('/app/calendar');
        }
    );

    //routes for facebook authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/',
            failureRedirect : '/signin' //testing
        }));

    // route to test if the user is logged in or not
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route for logging out
    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    })
};
