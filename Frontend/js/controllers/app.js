'use strict';

var app = angular.module('myApp', [
    "ngRoute", 
    "loginControllers",
    "navbarControllers"])
.config(function ($routeProvider) {
  $routeProvider.
    when('/', {
        templateUrl: 'partials/signin',
        controller: 'loginController'
    }).
    when('/signin', {
        templateUrl: 'partials/signin',
        controller: 'loginController'
    }).
    when('/profile', {
        templateUrl: 'partials/profile',
        controller: 'loginController'
    }).
    when('/calendar', {
        templateUrl: 'partials/calendar', 
        controller: 'loginController'
    }).
    otherwise({
      redirectTo: '/'
    });
});



// =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

//