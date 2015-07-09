module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            FacilityReservation.find({}, function(err, reservations){
                var res = new FacilityReservation(reservations[0]);
                socket.emit("calendarUpdate", reservations);
            })
        });

        socket.on("saveReservation", function(data){
            var res = new FacilityReservation(data.res)
            res.saveReservation(function(response){
                console.log("im back")
                socket.emit("reservationStatus", {
                    res: data.res,
                    message: response.message
                });
            });
        });

    });
}
