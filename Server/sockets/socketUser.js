module.exports = function (sockets) {

    var mongoose = require('mongoose');
    var UsersInfo = mongoose.model("User");
    var config = require('config')
    var FacilityReservation = mongoose.model("FacilityReservation");

    //console.log(mongoose.model("FacilityReservation"))
    sockets.on("connection", function(socket){
        socket.on("getUsers", function(data){
            UsersInfo.find({}, function(err, users){
                var theUsers = users;
                socket.emit("getUsers", users);
            });
        });

        socket.on("getReservations", function(data){
            FacilityReservation.find({}, function(err, reservations){
                var theReservations = reservations
                socket.emit("getReservations", reservations);
            });
        });

        socket.on("banUser", function(user){
            UsersInfo.findOne({_id:user._id},function(err, doc){
                doc.isbanned = user.isbanned
                if(!user.isbanned){
                    doc.bannedUntil = null;
                }
                doc.save(function(err){
                    if(err) return console.err(err); 
                    UsersInfo.find({}, function(err, users){
                        var theUsers = users
                        socket.emit("getUsers", users);

                    });
                })
            })
        });
    });
};
