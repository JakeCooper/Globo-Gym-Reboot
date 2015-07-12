var module = angular.module("adminControllers", []);

module.controller('adminController', ['$scope', 'socket',

    function ( $scope, socket ) {
            socket.emit("getUsers");
            socket.on("getUsers", function(data){
                $scope.users = data;
              
            })
     
           $scope.changeBan= function(user) {

               if(user.isbanned === false){
                     user.isbanned = true
                 }
                else{
                     user.isbanned = false
                 }   
               
                socket.emit("banUser", user);
           }
                 
    }
]);
