module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");
    var config = require('config')

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            console.log(data.rooms);
            FacilityReservation.find({ type: data.type, roomName: { $in:data.rooms }}, function(err, reservations){
                console.log(reservations)
                socket.emit("calendarUpdate", reservations);
            })
        });

        socket.on("getFacilityInfo", function(){
            socket.emit("FacilityInfo", { facility: config.mongoose.facility.types });
        });

        socket.on("saveReservation", function(data){
            var res = new FacilityReservation(data.res)
            console.log(res.start, res.end)
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
