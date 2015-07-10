var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket',
    function ( $scope, $compile, uiCalendarConfig, socket) {
    // get profile info
    socket.emit("getProfile");
    socket.on("profileInfo", function(data){
       $scope.username = data.username;
    });

    socket.on("reservationStatus", function(data){
        uiCalendarConfig.calendars["resCalendar"].fullCalendar( 'refetchEvents' )
        // alert the user that it worked
    });

    $scope.reservations = {
        events: function (start, end, timezone, callback) {
            socket.emit("calendarUpdate", {})
            socket.on("calendarUpdate", function(data){
                console.log(data)
                callback(data);
            })
        },
        color: 'yellow',
        textColor: 'black'
    };

    $scope.eventSources = [$scope.reservations];

    $scope.uiConfig = {
        calendar:{
            minTime: "08:00:00", //starts at 8am
            timezone: "local",
            ignoreTimezone: true,
            aspectRatio: 1,
            forceEventDuration: true,
            editable: false,
            defaultView: "agendaWeek",
            header:{
                left: 'agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: function(date, jsEvent, view){
                $scope.dateClicked = new Date(date);
                console.log('Clicked on: ' + $scope.dateClicked.toString());
                $scope.$broadcast('dayClicked');
            },
       }
    };
    }
]);

module.controller('modalController', function($scope,$modal){
    $scope.animationsEnabled = true;

    $scope.$on('dayClicked', function(){
        console.log( $scope.username);
        $modal.open({
            animation: $scope.animationsEnabled,
            scope: $scope,
            templateUrl: 'partials/addmodal',
            controller: 'modalInstanceController',
        });
    });
});

module.controller('modalInstanceController', function($scope, socket, $modalInstance){
    $scope.ok = function() {
        $scope.$broadcast('saveReservation');
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

module.controller('timepickerController', function ($scope, socket, $log) {
    $scope.startTime = new Date($scope.dateClicked.toString());
    $scope.endTime = new Date($scope.dateClicked.toString());

    $scope.$on('saveReservation', function () {
        var hours   = Math.floor($scope.selectedDuration / 60);
        var minutes = $scope.selectedDuration % 60; 
        $scope.endTime = new Date($scope.startTime);
        $scope.endTime.setHours($scope.startTime.getHours()+hours);
        $scope.endTime.setMinutes($scope.startTime.getMinutes()+minutes);
        console.log('roomname: ' + $scope.selectedRoom);
        var reservation = {
            res: {
                roomName: "The White Goodman Tennis Room", //roomName: $scope.selectedRoom,
                type: "tennisCourt", 
                user: $scope.username,
                title: $scope.eventTitle,
                start: $scope.startTime,
                end:  $scope.endTime
            }
        }
        socket.emit("saveReservation", reservation);
    });

    $scope.changed = function () {
        $log.log('Starttime changed to: ' + $scope.startTime);
    };
    $scope.selectedDuration = 30; 
    $scope.startTime.setMinutes(0);
    $scope.hstep = 1;
    $scope.mstep = 30;
});

module.controller('accordianController', function ($scope) {

  $scope.selectedRoom = 'spinning1';

 $scope.tennisItems = [
     { id: 1, name: 'tennis1' },
     { id: 2, name: 'tennis2' },
     { id: 3, name: 'tennis3' },
     { id: 4, name: 'tennis4' },
     { id: 5, name: 'tennis5' }
   ];
 
});