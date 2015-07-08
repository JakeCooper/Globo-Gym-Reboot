angular.module("menuControllers", [])
.controller('menuController', ['$scope','socket',
    function ($scope, socket) {
        socket.emit("getProfile");
        socket.on("profileInfo", function(data){
            $(".profile-container").children("img").attr('src', data.photo.replace("sz=50", "sz=75"));
            $(".profile-container").css("opacity", "1.0");
        });
    }
])
.directive("mySidebar", function(){
    return {
        restrict:"E",
        //scope: {},
        templateUrl: "partials/sidebar"
    };
});
