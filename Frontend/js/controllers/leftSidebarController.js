var module = angular.module("leftSidebarControllers", []);

module.controller('leftSidebarController', ['$scope', 'socket',
    function ( $scope, socket ) {
        socket.emit("getProfile");
        socket.on("profileInfo", function(data){
        	$scope.username = data.username;
            alert(JSON.stringify(data))
        });
    }
]);
