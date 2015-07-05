'use strict';

var app = angular.module('myApp', [
    "ngRoute",
    "ui.calendar",
    "ui.bootstrap",
    "loginControllers",
    "calendarControllers",
    "navbarControllers"])
.config(function ($routeProvider, $locationProvider) {
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
        controller: 'calendarController'
    }).
    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});


