var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket',
    function ( $scope, $compile, uiCalendarConfig, socket, $modal) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var h = date.getHours();
    /* event source that contains custom events on the scope */
    socket.emit("calendarUpdate", {})
    $scope.events = [];

    $scope.reservations = {
        events: function (start, end, timezone, callback) {
            socket.on("calendarUpdate", function(data){
                callback(data);
            })
        },
        color: 'yellow',
        textColor: 'black'
    };

    $scope.eventSources = [$scope.reservations,$scope.events];
    $scope.$on('pushEvent', function(title, start, end){
        $scope.events.push({
            title: title,
            start: start,
            end: end,
        });
    });

    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Coles Test',
        start: new Date(y, m, d, h, 0),
        end: new Date(y, m, d, h, 30),
      });
    };

    $scope.uiConfig = {
        calendar:{
            minTime: "08:00:00",
            forceEventDuration: true,
            height: "100%",
            editable: true,
            header:{
                left: 'month agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            dayClick: function(){
                var modalInstance = $modal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'partials/addmodal.html',
                  controller: 'modalInstanceController',
                  size: 'sm',
                });
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
        var startTime = $scope.startTime;
        var endTime = $scope.endTime;
    };
    $scope.open = function (size) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addmodal.html',
          controller: 'modalInstanceController',
          size: size,
        });
    };

});

module.controller('modalInstanceController', function($scope, $modalInstance){
    var startTime =  new Date();
    var endTime = new Date();


    $scope.ok = function () {
        var title = $scope.eventTitle;
        startTime = $scope.startTime;
        endTime = $scope.endTime;
        $scope.$emit('pushEvent', title, startTime, endTime);

        $modalInstance.close();

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
module.controller('timepickerController', function ($scope, $log) {
  $scope.startTime = new Date();
  $scope.startTime.setMinutes(0);
  $scope.endTime = new Date();
  $scope.endTime.setMinutes(0);
  $scope.hstep = 1;
  $scope.mstep = 30;

});