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
});


//