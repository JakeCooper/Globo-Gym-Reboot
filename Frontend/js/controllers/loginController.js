var module = angular.module("loginControllers", []);

module.controller('loginController', ['$scope', 'socket',
    function ( $scope, socket ) {
        // sample is initially empty
        $scope.sample = "";

        // When the scope recieves the 'sample' message change
        // the scope to the recieved message
        socket.on("sample", function(data){
            $scope.sample = data.sample;
        });
    }
]);
