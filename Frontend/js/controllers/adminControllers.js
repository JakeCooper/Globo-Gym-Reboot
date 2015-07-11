var module = angular.module('adminControllers', []);

module.controller('adminController', ['$scope', 'socket',
                                     
    function ( $scope, socket ) {
        this.message = "seng299";  
        socket.emit("getUsers");
        socket.on("usersInfo", function(data){
            
            $scope.users=data;
            
        });
    }
]);
