var module = angular.module("loginControllers", []);

module.controller('profileController', ['$scope', 'socket',
    function ( $scope, socket ) {
        socket.emit("getProfile");
        socket.on("profileInfo", function(data){
            alert(JSON.stringify(data))
        });
    }
]);
