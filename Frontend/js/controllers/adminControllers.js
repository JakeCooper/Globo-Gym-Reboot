var module = angular.module("adminControllers", []);

module.controller('adminController', ['$scope', 'socket',

    function ( $scope, socket ) {
            socket.emit("getUsers");
            socket.on("getUsers", function(data){
                $scope.users = data;
              
            })
            
            socket.emit("getReservations");
            socket.on("getReservations", function(data){
                $scope.reservations = data.sort(function(a, b) {
               a = new Date(a.start);
               b = new Date(b.start);
               return b>a ? -1 : b<a ? 1 : 0;
           });
              
            })
            
            
            $scope.deleteReservation = function(reservation){
                socket.emit("deleteEvent", reservation);
                 socket.emit("getReservations");
            }
     
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
