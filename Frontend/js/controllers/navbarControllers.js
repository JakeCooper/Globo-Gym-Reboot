angular.module("navbarControllers", [])
.controller('menuController', ['$scope',
    function ($scope) {
    }
])
.directive("myNavbar", function(){
    return {
        restrict:"E",
        //scope: {},
        templateUrl: "partials/navbar"
    };
});
