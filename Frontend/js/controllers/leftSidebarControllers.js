var module = angular.module("leftSidebarControllers", []);

module.controller('leftSidebarController', function($scope, socket){
	socket.emit("getProfile");
    socket.on("profileInfo", function(data){

       $scope.username = data.username;
<<<<<<< HEAD

=======
>>>>>>> 6a0f9deb9efefdb89577882b5ac943edf2a1654c
    });

});