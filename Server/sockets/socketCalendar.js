module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");
    var config = require('config')

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            FacilityReservation.find({ type: data.type, roomName: { $in:data.rooms }}, function(err, reservations){
                socket.emit("calendarUpdate", reservations);
            })
        });

        socket.on("getFacilityInfo", function(){
            socket.emit("FacilityInfo", { facility: config.mongoose.facility.types });
        });

        socket.on("getUserEvents", function(data){
            var user = {}
            user.id = socket.user.googleid || socket.user.facebookid;
            FacilityReservation.getUserEvents(user, function(response){
                socket.emit("userEventsList", response);
            });
        });

        socket.on("deleteEvent", function(res){
            FacilityReservation.remove({"_id": res._id}, function(err){
            })
        });


        socket.on("saveReservation", function(data){
            var res = new FacilityReservation(data.res)
            res.saveReservation(function(response){
                socket.emit("reservationStatus", {
                    res: data.res,
                    message: response.message
                });
                if(response.success) {
                    socket.broadcast.emit("calendarHasChanged");
                }
            });
        });

    });
}
