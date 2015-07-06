angular.module("menuControllers", [])
.controller('menuController', ['$scope',
    function ($scope) {
    }
])
.directive("mySidebar", function(){
    return {
        restrict:"E",
        //scope: {},
        templateUrl: "partials/sidebar"
    };
});
