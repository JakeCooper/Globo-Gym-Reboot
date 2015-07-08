var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket',
    function ( $scope, $compile, uiCalendarConfig, socket) {
    /* event source that contains custom events on the scope */

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

    $scope.eventSources = [$scope.reservations];

    $scope.uiConfig = {
        calendar:{
            height: "100%",
            editable: true,
            header:{
                left: 'month agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
       }
    };
    }
]);
