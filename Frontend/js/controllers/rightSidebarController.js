var module = angular.module("rightSidebarController", []);

module.controller('rightSidebarController', ['$scope', 'socket',
    function ( $scope, socket ) {
        socket.emit("getProfile");
        socket.on("profileInfo", function(data){
            alert(JSON.stringify(data))
        });
    }
]);