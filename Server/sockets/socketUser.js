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

        socket.on("adminRemove", function(res){
            UsersInfo.findOne({_id:socket.user._id}, function(err, user){
                if(err) return console.err(err);
                if(user.isadmin){
                    FacilityReservation.remove({"_id": res._id}, function(err){
                        if(err) return console.err(err);
                        socket.broadcast.emit("calendarHasChanged");
                        FacilityReservation.find({}, function(err, reservations){
                            var theReservations = reservations;
                            socket.emit("getReservations", reservations);
                        });
                    })
                }
            });
        });

        socket.on("banUser", function(user){
            UsersInfo.findOne({_id:user._id},function(err, doc){
                doc.isbanned = user.isbanned;
                doc.bannedUntil = new Date("2055-07-15T10:08:27.619Z")
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
