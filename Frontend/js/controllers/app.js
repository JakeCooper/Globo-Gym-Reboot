'use strict';
console.log("Sup bb");

// Declare app level module which depends on filters, and services

angular.module('myApp', ["ngRoute", "loginController"]).
config(function ($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/signin'
        //, controller: 'loginController'
    }).
    //when('/view2', {
    //  templateUrl: 'partials/partial2',
    //  controller: 'MyCtrl2'
    //}).
    otherwise({
      redirectTo: '/'
    });
});
