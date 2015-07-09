var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket',
    function ( $scope, $compile, uiCalendarConfig, socket, $modal) {
    var dateClicked = new Date();
    var startDate = new Date();
    var endDate = new Date();

    /* event source that contains custom events on the scope */

    socket.emit("saveReservation", {
        res: {
            roomName: "The White Goodman Tennis Room",
            type: "tennisCourt",
            user: "Andrei",
            title: 'TENNIS GAME!!!!',
            start: new Date("Wed Jul 08 2015 9:30:00 GMT-0700 (PDT)"),
            end: new Date("Wed Jul 08 2015 10:00:00 GMT-0700 (PDT)")
        }
    })

    socket.on("reservationStatus", function(data){
        uiCalendarConfig.calendars["resCalendar"].fullCalendar( 'refetchEvents' )
        alert(data.message);
    });

    $scope.events = [];

    $scope.reservations = {
        events: function (start, end, timezone, callback) {
            socket.emit("calendarUpdate", {})
            socket.on("calendarUpdate", function(data){
                callback(data);
            })
        },
        color: 'yellow',
        textColor: 'black'
    };

    $scope.eventSources = [$scope.reservations,$scope.events];

    $scope.$root.$on('setTime', function(event, start, end){
        startDate = new Date(start);
        endDate = new Date(end);
    });

    $scope.$root.$on('pushEvent', function(event, title){
        startDate.setMonth(dateClicked.getMonth());
        startDate.setDate(dateClicked.getDate());
        endDate.setMonth(dateClicked.getMonth());
        endDate.setDate(dateClicked.getDate());
        console.log('Start date: ' + startDate);
        $scope.events.push({
            title: title,
            start: startDate,
            end: endDate,
        });
    });

    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
      });
    };

    $scope.uiConfig = {
        calendar:{
            minTime: "08:00:00",
            forceEventDuration: true,
            height: "100%",
            editable: false,
            defaultView: "agendaWeek",
            header:{
                left: 'agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: function(date, jsEvent, view){
                dateClicked =  new Date(date);
                console.log('Clicked on: ' + dateClicked.toString());
                $scope.$root.$broadcast('dayClicked');
            },
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
       }
    };
    }
]);
module.controller('modalController', function($scope,$modal){
    $scope.animationsEnabled = true;
    $scope.createEvent = function ($scope) {
       // var startTime = $scope.startTime;
       // var endTime = $scope.endTime;
    };

    $scope.open = function () {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addmodal',
          controller: 'modalInstanceController',
        });
     };

     $scope.$root.$on('dayClicked', function(){
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addmodal',
          controller: 'modalInstanceController',
        });
    });
});

module.controller('modalInstanceController', function($scope, $modalInstance){

    $scope.ok = function () {
        $scope.$root.$broadcast('pushEvent', $scope.eventTitle);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

module.controller('timepickerController', function ($scope, $log) {
    $scope.startTime = new Date();
    $scope.endTime = new Date();

    $scope.changed = function () {
        $log.log('Starttime changed to: ' + $scope.startTime);
        $log.log('Endtime changed to: ' + $scope.endTime);
        $scope.$root.$broadcast('setTime', $scope.startTime, $scope.endTime);
    };

    socket.emit("saveReservation", {
        res: {
            roomName: "Me'Shell Jones Tennis Room",
            type: "tennisCourt",
            user: "Andrei",
            title: 'TENNIS GAME!!!!',
            start: new Date(),
            end: new Date("Wed Jul 08 2015 10:42:10 GMT-0700 (PDT)")
        }
    })

    $scope.startTime.setMinutes(0);
    $scope.endTime.setMinutes(30);
    $scope.hstep = 1;
    $scope.mstep = 30;


});
