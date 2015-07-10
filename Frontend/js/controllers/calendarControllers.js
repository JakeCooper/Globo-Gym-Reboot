var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket', '$timeout',
    function ( $scope, $compile, uiCalendarConfig, socket, $timeout) {
    // get profile info
    socket.emit("getProfile");
    socket.on("profileInfo", function(data){
       $scope.username = data.username;
    });

    socket.emit("getFacilityInfo");
    socket.on("FacilityInfo", function(data){
        console.log("The Facility", data.facility);
        var roomTypes = Object.keys(data.facility);
        $scope.roomTypes = roomTypes.map(function(thisType){
            return { type: thisType };
        });

        console.log(roomTypes);
        for(var i = 0; i < roomTypes.length; i++){
            var roomType = roomTypes[i]
            var roomNames =Object.keys(data.facility[roomType]);
            console.log(roomNames)
            $scope[roomType] = roomNames;
        }
        $scope.scope = $scope;
    });

    // for checkboxes
    $scope.roomsSelected = {};
    
    $scope.update = function(){
        uiCalendarConfig.calendars[$scope.getActive()].fullCalendar( 'refetchEvents' )
    };

    socket.on("reservationStatus", function(data){
        uiCalendarConfig.calendars[$scope.getActive()].fullCalendar( 'refetchEvents' )
        // alert the user that it worked
        alert(data.message);
    });

    $scope.reservations = {
        events: function (start, end, timezone, callback) {
            var selectedRooms = Object.keys( $scope.roomsSelected ).filter(function(key){
                return $scope.roomsSelected[key]
            })
            console.log(selectedRooms)
            socket.emit("calendarUpdate", { type: $scope.getActive(), rooms: selectedRooms });
            socket.on("calendarUpdate", function(data){
                //console.log(data)
                callback(data);
            });
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
                $scope.$broadcast('dayClicked');
            },
       }
    };

    //render calendar
    $scope.renderCalender = function(calendar) {
        console.log(calendar);
        if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    
    $scope.selectTab = function(){
        $timeout(function () {
                for(var i = 0; i < $scope.roomTypes.length; i++){
                    $scope.renderCalender($scope.roomTypes[i].type);
                }
        }, 0);
    };

    $scope.getActive = function() {
        return $scope.roomTypes.filter(function(val){ return val.active})[0].type
    };

}]);

module.controller('modalController', function($scope,$modal){
    $scope.animationsEnabled = true;

    $scope.$on('dayClicked', function(){
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

    $scope.$on('saveReservation', function () {
        var hours   = Math.floor($scope.selectedDuration / 60);
        var minutes = $scope.selectedDuration % 60;
        $scope.endTime = new Date($scope.startTime);
        $scope.endTime.setHours($scope.startTime.getHours()+hours);
        $scope.endTime.setMinutes($scope.startTime.getMinutes()+minutes);
        var reservation = {
            res: {
                roomName: $scope.selectedRoomname,
                type: $scope.selectedRoomtype,
                user: $scope.username,
                title: $scope.eventTitle || $scope.defaultTitle,
                start: $scope.startTime,
                end:  $scope.endTime
            }
        }
        console.log("event emitted", reservation)
        socket.emit("saveReservation", reservation);
    });

    $scope.changed = function () {
        $log.log('Starttime changed to: ' + $scope.startTime);
        $scope.defaultTitle = $scope.username + " booking for " + $scope.selectedRoomname;
    };
    $scope.selectedDuration = 30;
    $scope.startTime.setMinutes(0);
    $scope.hstep = 1;
    $scope.mstep = 30;
});
