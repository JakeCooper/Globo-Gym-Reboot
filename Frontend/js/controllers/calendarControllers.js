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

    $scope.$root.$on('pushEvent', function(event, title, start, end){
        var startTime = start;
        var endTime = end;
        $scope.events.push({
            title: title,
            start: startTime,
            end: endTime,
        });
    });

    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: title,
            start: start,
            end: end,
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
            dayClick: function(date){
                $scope.$root.$broadcast('dayClicked', date);
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
    $scope.open = function () {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addmodal.html',
          controller: 'modalInstanceController',
        });
    };
     $scope.$root.$on('dayClicked', function(event, date){
        $scope.$root.$broadcast('getDate', date);
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addmodal.html',
          controller: 'modalInstanceController',
        });
    });

});

module.controller('modalInstanceController', function($scope, $modalInstance){

    $scope.ok = function () {

        $scope.$root.$broadcast('pushEvent', $scope.eventTitle, $scope.startTime, $scope.endTime);

        $modalInstance.close();

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
     $scope.$root.$on('closeModal', function(){
        $modalInstance.close();
    });

});
module.controller('timepickerController', function ($scope, $log) {
  $scope.startTime = new Date();
  $scope.endTime = new Date();
  $scope.$root.$on('getDate', function(event, date){
    $scope.startTime = date;
    $scope.endTime = date;
  });

  $scope.startTime.setMinutes(0);
  $scope.endTime.setMinutes(0);
  $scope.hstep = 1;
  $scope.mstep = 30;


});