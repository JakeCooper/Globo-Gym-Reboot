var module = angular.module("calendarControllers", []);

module.controller('calendarController', ['$scope', '$compile', 'uiCalendarConfig', 'socket',
    function ( $scope, $compile, uiCalendarConfig, socket) {
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
                  template: '<table> <tr> <td> <input type="checkbox" name="dlg_allday" id="dlg_allday" value="1" checked="{$IN.allday}" />allday </td> </tr> <tr> <td> Start: </td> <td align="left"> <input type="text" id="event_start_date" name="event_start_date" value="{$IN.event_start_date}" style="width:120px;" /> <input type="text" id="event_start_time" name="event_start_time" value="{$IN.event_start_time}" style="width:80px;" /> </td> </tr> <tr> <td> End: </td> <td align="left"> <input type="text" id="event_end_date" name="event_end_date" value="{$IN.event_end_date}" style="width:120px;" /> <input type="text" id="event_end_time" name="event_end_time" value="{$IN.event_end_time}" style="width:80px;"/> </td> </tr> <tr> <td> Subject: </td> <td align="left"> <input type="text" id="event_subject" name="event_subject" maxlength="255" style="width:460px;"/> </td> </tr> </table> <center><textarea name="event_description" id="event_description" rows="9" style="width:520px;"></textarea></center> <center> <button type="button" id="dlgcommit">New event</button> <button type="button" id="dlgcancel">Cancel</button> </center> </form>',
                  // '<div class="modal-header"><h3 class="modal-title">I m a modal!</h3></div>',
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

    $scope.open = function (size) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          template: '<table> <tr> <td> <input type="checkbox" name="dlg_allday" id="dlg_allday" value="1" checked="{$IN.allday}" />allday </td> </tr> <tr> <td> Start: </td> <td align="left"> <input type="text" id="event_start_date" name="event_start_date" value="{$IN.event_start_date}" style="width:120px;" /> <input type="text" id="event_start_time" name="event_start_time" value="{$IN.event_start_time}" style="width:80px;" /> </td> </tr> <tr> <td> End: </td> <td align="left"> <input type="text" id="event_end_date" name="event_end_date" value="{$IN.event_end_date}" style="width:120px;" /> <input type="text" id="event_end_time" name="event_end_time" value="{$IN.event_end_time}" style="width:80px;"/> </td> </tr> <tr> <td> Subject: </td> <td align="left"> <input type="text" id="event_subject" name="event_subject" maxlength="255" style="width:460px;"/> </td> </tr> </table> <center><textarea name="event_description" id="event_description" rows="9" style="width:520px;"></textarea></center> <center> <button type="button" id="dlgcommit">New event</button> <button type="button" id="dlgcancel">Cancel</button> </center> </form>',
          // '<div class="modal-header"><h3 class="modal-title">I m a modal!</h3></div>',
          controller: 'modalInstanceController',
          size: size,
        });
    };
});

module.controller('modalInstanceController', function($scope, $modalInstance){
    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});