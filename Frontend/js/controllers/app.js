'use strict';

var app = angular.module('myApp', [
    "ngRoute",
    "ui.calendar",
    "ui.bootstrap",
    "loginControllers",
    "profileControllers",
    "calendarControllers",
    "menuControllers",
    "adminControllers",
    "leftSidebarControllers"
    ])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
        templateUrl: 'partials/signin',
        controller: 'loginController',
    }).
    when('/app/about', {
        templateUrl: 'partials/about',
        controller: 'loginController'
    }).
    when('/app/profile', {
        templateUrl: 'partials/profile',
        controller: 'loginController',
        resolve:{
            loggedin: checkLoggedin
        }
    }).
    when('/app/regpol', {
        templateUrl: 'partials/regpol',
        controller: 'loginController',

    }).
    when('/app/calendar', {
        templateUrl: 'partials/calendar',
        controller: 'calendarController',
        resolve:{
            loggedin: checkLoggedin
        }
    }).
    when('/app/users', {
        templateUrl: 'partials/users',
        controller: 'adminController',
        resolve:{
            loggedin: checkAdmin
        }

    }).
    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
            // Authenticated
        if (user !== '0') deferred.resolve();
            // Not Authenticated
        else {
            $rootScope.message = 'You need to log in.';
            deferred.reject();
            $location.url('/app/signin');
        }
    });

    return deferred.promise;
};

var checkAdmin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();

    $http.get('/loggedin').success(function(user){
        if (user.isadmin === true) deferred.resolve();
            // Not Authenticated
        else {
            $rootScope.message = 'You must be an admin.';
            deferred.reject();
            $location.url('/app/signin');
        }
    });
    return deferred.promise;
};
