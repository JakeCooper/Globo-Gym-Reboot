var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket', '$timeout',
    function ( $scope, $compile, uiCalendarConfig, socket, $timeout) {
    // get profile info
    socket.emit("getProfile");
    socket.on("profileInfo", function(data){
       $scope.username = data.username;
       $scope.firstname = $scope.username.split(" ")[0];
       $scope.hideAdminButtons = !data.isadmin;
       $scope.$broadcast('seeUserEvents');
    });

    socket.emit("getFacilityInfo");
    socket.on("FacilityInfo", function(data){
        var roomTypes = Object.keys(data.facility);
        $scope.roomTypes = roomTypes.map(function(thisType){
            return { type: thisType };
        });
        $scope.colors = {};

        for(var i = 0; i < roomTypes.length; i++){
            var roomType = roomTypes[i];

            var roomNames = Object.keys(data.facility[roomType]);
            $scope[roomType] = roomNames;
            for(var j = 0; j < roomNames.length; j++){
                $scope.colors[roomNames[j]] = data.facility[roomType][roomNames[j]].displayColor;
            }
        }
        $scope.roomTypes[0].active = true;
        $scope.scope = $scope;
    });
    $scope.seeEvents = function(){
        socket.emit("getUserEvents",{res: $scope.username});
    };
    // for checkboxes
    $scope.roomsSelected = {};

    $scope.update = function(){
        uiCalendarConfig.calendars[$scope.getActive()].fullCalendar( 'refetchEvents' );
        $scope.seeEvents();
    };
    socket.on("userEventsList", function(data){
           $scope.userEvents = data.sort(function(a, b) {
               a = new Date(a.start);
               b = new Date(b.start);
               return b>a ? -1 : b<a ? 1 : 0;
           });
    });
    socket.on("calendarHasChanged", function(){
        $scope.update();
    });

    socket.on("reservationStatus", function(data){
        $scope.update();
        // alert the user that it worked
        var state;
        var header;
        if (data.success == true){
            state = "success";
            header = "Success!";
        } else {
            state = "danger";
            header = "Error!";
        }
        alertFactory(state, header, data.message);
    });

    $scope.reservations = {
        events: function (start, end, timezone, callback) {
            var selectedRooms = Object.keys( $scope.roomsSelected ).filter(function(key){
                return $scope.roomsSelected[key]
            });
            socket.emit("calendarUpdate", { type: $scope.getActive(), rooms: selectedRooms });
            socket.on("calendarUpdate", function(data){
                for(var i = 0; i < data.length; i++){
                    data[i].color = $scope.colors[data[i].roomName];
                }
                callback(data);
            });
        }
    };

    $scope.eventSources = [$scope.reservations];

    $scope.uiConfig = {
        calendar:{
            minTime: "8:00:00", //starts at 8am
            timezone: "local",
            ignoreTimezone: true,
            aspectRatio: 1,
            forceEventDuration: true,
            editable: false,
            defaultView: "agendaWeek",
            header: {
                left: 'agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: function(date, jsEvent, view){
                $scope.dateClicked = new Date(date);
                $scope.$broadcast('dayClicked');
            }
       }
    };

    //render calendar
    $scope.renderCalender = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };

    $scope.selectTab = function(){
        $timeout(function () {
            $scope.roomsSelected[$scope[$scope.getActive()][0]] = true;
            $scope.renderCalender($scope.getActive());
        }, 0);
    };
    $scope.userEventsTab = function(){
        socket.emit("getUserEvents",{res: $scope.username});
        $timeout(function () {
            $scope.reservations = $scope.userEvents;
            //$scope.roomsSelected[$scope[$scope.getActive()][0]] = true;
            $scope.renderCalender('userEvents');
        }, 0);
    };

    $scope.getActive = function() {
        return $scope.roomTypes.filter(function(val){
            return val.active})[0].type
    };
}]);

module.controller('modalController', function($scope,$modal){
    $scope.animationsEnabled = true;

    $scope.$on('dayClicked', function(){
        $modal.open({
            animation: $scope.animationsEnabled,
            scope: $scope,
            templateUrl: 'partials/addmodal',
            controller: 'modalInstanceController'
        });
    });
});

module.controller('modalInstanceController', function($scope, socket, $modalInstance){
    $scope.ok = function() {
        $modalInstance.close();
        $scope.$broadcast('saveReservation');
        $scope.seeEvents();
        
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

module.controller('timepickerController', function ($scope, socket, $log) {
    $scope.startTime = new Date($scope.dateClicked);

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
        };
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



module.controller('eventModalController', function ($scope, socket, $modal){
    $scope.animationsEnabled = true;
    
    $scope.deleteEvent = function(res){
        $scope.selectedEvent = res;
        $modal.open({ 
            animation: $scope.animationsEnabled,
            scope: $scope,
            templateUrl: 'partials/eventsmodal',
            controller: 'eventModalInstanceController'
        });
        
    };

});

module.controller('eventModalInstanceController', function($scope, socket, $modalInstance){
    $scope.confirmedDelete = function(res){
        $modalInstance.close();
        socket.emit("deleteEvent", res);
        alertFactory("success", "Success!", "Booking successfully deleted");
        $scope.update();
        $scope.seeEvents();

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

var alertFactory = function(state, header, message){
    var el = $("<div/>")
        .addClass("alert")
        .addClass("alert-" + state)
        .addClass("fade")
        .addClass("in")
        .append(
        $("<a/>")
            .on('click', function(){
                $(el).css({
                    opacity: 0.0
                });
                $(el).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                    el.remove();
                })
            })
            .addClass("close")
            .attr("aria-label", "close")
            .html("&nbsp;&times;"))
        .append("<strong>" + header + "</strong> " + message)
    $('.alert-container').append(
        el
    );
    window.setTimeout(function(){
        $(el).css({
            opacity: 0.0
        });
        $(el).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
            el.remove();
        })
    }, 10000)
};

module.controller('profileModalController', function ($scope, socket, $modal){
    $scope.animationsEnabled = true;
    socket.emit("getProfile");
    socket.on("profileInfo", function(data){
        var name = data.username.split(" ")
        if(name.length == 2){
            $scope.first = name[0]
            $scope.last = name[1]
        }
        else if(name.length == 3){
            $scope.first = name[0]
            $scope.username = name[1]
            $scope.last = name[2]
        }
        else{
            $scope.first = data.username
        }
        $scope.photo = data.photo.replace("sz=50", "sz=400")
    });
    $scope.openProfile = function(res){
        $scope.selectedEvent = res;
        $modal.open({ 
            animation: $scope.animationsEnabled,
            scope: $scope,
            templateUrl: 'partials/profile',
            controller: 'eventModalInstanceController',
            size: 'lg'
        });
        
    };

});

module.controller('profileModalInstanceController', function($scope, socket, $modalInstance){
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
