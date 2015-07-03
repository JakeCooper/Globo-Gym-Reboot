'use strict';

var app = angular.module('myApp', [
    "ngRoute", 
    "loginControllers",
    "navbarControllers"])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
        templateUrl: 'partials/signin',
        controller: 'loginController'
    }).
    when('/login', {
        templateUrl: 'partials/login',
        controller: 'loginController'
    }).
    when('/profile', {
        templateUrl: 'partials/login',
        controller: 'loginController'
    }).
    when('/calendar', {
        templateUrl: 'partials/calendar', 
        controller: 'loginController'
    }).
    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});
