module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            FacilityReservation.find({}, function(err, reservations){
                console.log(reservations[0]);
                var res = new FacilityReservation(reservations[0]);
                console.log(res.isValidRoom())
                socket.emit("calendarUpdate", reservations);
            })
        });

        socket.on("saveReservation", function(data){
            var res = new FacilityReservation(data.res)
            res.saveReservation(function(response){
                socket.emit("reservationStatus", {
                    res: data.res,
                    message: response.message
                });
            });
        });

    });
}
