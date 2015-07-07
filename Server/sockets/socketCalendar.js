module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            FacilityReservation.find({}, function(err, reservations){
                console.log(reservations[0]);
                res = new FacilityReservation(reservations[0]);
                console.log(res.isValidRoom())
                socket.emit("calendarUpdate", reservations);
            })
        });
    });
}
