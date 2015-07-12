var module = angular.module("leftSidebarControllers", []);

module.controller('leftSidebarController', ['$scope', 'socket',
    function ( $scope, socket ) {
        socket.emit("getProfile");
        socket.on("profileInfo", function(data){
            alert(JSON.stringify(data))
        });
    }
]);
