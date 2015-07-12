var module = angular.module("leftSidebarControllers", []);

module.controller('leftSidebarController', function($scope, socket){
    socket.emit("getProfile");
    socket.on("profileInfo", function(data){
       $scope.firstName = data.username.split(" ")[0];
       console.log(data);
       $scope.username = data.username;
    });
});