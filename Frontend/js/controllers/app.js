'use strict';

var app = angular.module('myApp', ["ngRoute", "loginControllers"]).
config(function ($routeProvider) {
  $routeProvider.
    when('/', {
        templateUrl: 'partials/signin',
        controller: 'loginController'
    }).
    when('/calendar', {
        templateUrl: 'partials/calendar', 
        controller: 'loginController'
    }).
    //when('/view2', {
    //  templateUrl: 'partials/partial2',
    //  controller: 'MyCtrl2'
    //}).
    otherwise({
      redirectTo: '/'
    });
});
