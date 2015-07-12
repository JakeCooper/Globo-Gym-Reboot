var module = angular.module("leftSidebarControllers", []);

module.controller('leftSidebarController', function($scope, socket){
	socket.emit("getUserEvents",{res: $scope.username});
	socket.emit("getProfile");
    socket.on("profileInfo", function(data){
       $scope.username = data.username;
       console.log($scope.username);
       socket.emit("getUserEvents",{res: $scope.username});
    });

});