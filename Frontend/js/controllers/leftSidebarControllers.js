var module = angular.module("leftSidebarControllers", []);

module.controller('leftSidebarController', function($scope, socket){
	socket.emit("getProfile");
    socket.on("profileInfo", function(data){

       $scope.username = data.username;
<<<<<<< HEAD
=======
       console.log($scope.username);
       console.log($scope.firstName);
>>>>>>> 8121e969bc9c1a9e17f7e122b8a1d737db0b666f
    });

});