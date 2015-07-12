module.exports = function (sockets) {
    
    var mongoose = require('mongoose');
    var UsersInfo = mongoose.model("User");
    var config = require('config')
    
    //console.log(mongoose.model("FacilityReservation")) 
    sockets.on("connection", function(socket){
          socket.on("getUsers", function(data){
              UsersInfo.find({}, function(err, users){ 
                console.log(users)
                socket.emit("getUsers", users);

            });
        });
    });
};
