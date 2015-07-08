var module = angular.module("profileControllers", []);

module.controller('profileController', ['$scope', 'socket',
    function ( $scope, socket ) {
        socket.emit("getProfile");
        socket.on("profileInfo", function(data){
            alert(JSON.stringify(data))
        });
    }
]);
