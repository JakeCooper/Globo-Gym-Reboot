var module = angular.module("adminControllers", []);

module.controller('adminController', ['$scope', 'socket',
                                     
    function ( $scope, socket ) {
        
            socket.emit("getUsers");
            socket.on("getUsers", function(data){
                $scope.users = data;
                console.log(data)
            })
    }

]);
