module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            FacilityReservation.find({}, function(err, user){
                console.log("update")
                console.log(err, user)
                socket.emit("calendarUpdate", user);
            })
        });
    });
}
