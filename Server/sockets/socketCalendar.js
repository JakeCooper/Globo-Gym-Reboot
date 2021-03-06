// outlines the logic for the calendar page
module.exports = function (sockets) {
    var mongoose = require('mongoose');
    var FacilityReservation = mongoose.model("FacilityReservation");
    var User = mongoose.model("User");
    var config = require('config');

    sockets.on("connection", function(socket){
        socket.on("calendarUpdate", function(data){
            // data = {
            //  rooms: [
            //      roomname1: String, // name of room to search for
            //      roomname2: String, // name of room to search for
            //      ...
            //  ]
            //  type: String // Type of room that is being searched for
            // }
            FacilityReservation.find({ type: data.type, roomName: { $in:data.rooms }}, function(err, reservations){
                socket.emit("calendarUpdate", reservations);
                // reservations = [ // list of facility reservations
                //  event1: FacilityReservation, // see API/facilityReservation.md
                //  event2: FacilityReservation,
                //  ...
                // ]
            })
        });

        // return the facility object see API/facilityObject
        socket.on("getFacilityInfo", function(){
            socket.emit("FacilityInfo", { facility: config.mongoose.facility.types });
        });

        socket.on("getUserEvents", function(data){
            var user = {};
            user.id = socket.user.googleid || socket.user.facebookid;
            // defined in Facility Reservation
            FacilityReservation.getUserEvents(user, function(response){
                socket.emit("userEventsList", response);
            });
        });

        socket.on("deleteEvent", function(res){
            var now = new Date();
            var start = new Date(res.start);
            FacilityReservation.remove({"_id": res._id}, function(err){
                if(err) return console.err(err);
                if(start.getTime() - now.getTime() < config.mongoose.minCancelTime * config.time.hourInMilliseconds){
                    User.findOne({_id:socket.user._id}, function(err, user){
                        user.isbanned = true;
                        user.bannedUntil = new Date(now.getTime() + config.mongoose.banTime * config.time.hourInMilliseconds);
                        user.save(function(err){
                            if(err) return console.err(err);
                            socket.emit("reservationStatus", {
                                message: "You are now Banned from booking for " + config.mongoose.banTime + " hours",
                            });
                            socket.broadcast.emit("calendarHasChanged");
                            socket.emit("profileInfo", user);
                            return;
                        });
                    });
                }
                socket.emit("reservationStatus", {
                    message: "Reservation was removed Successfully",
                    success: true
                });
            })
        });

        socket.on("saveReservation", function(data){
            User.findOne({_id:socket.user._id}, function(err, user){
                if(user.isbanned){
                    if(new Date(user.bannedUntil) < new Date()){
                        // remove the ban if the ban time has passed
                            user.isbanned = false;
                            user.bannedUntil = null;
                            user.save();
                    }else{
                        socket.emit("reservationStatus", {
                            res: data.res,
                            message: "You are banned from making reservations",
                            success: false
                        });
                        return;
                    }
                }
                data.res.id = user.googleid || user.facebookid;
                FacilityReservation.count({id:data.res.id}, function(err, count){
                    if(count >= config.mongoose.maxReservations){
                        socket.emit("reservationStatus", {
                            message: "You have too many reservations",
                            success: false
                        });
                    }else{
                        FacilityReservation.findOne({
                            id:data.res.id,
                            $or: [
                                { start: { $gte: new Date(data.res.start), $lt: new Date(data.res.end) } },
                                { end: { $gt: new Date(data.res.start), $lte: new Date(data.res.end) } }
                            ]
                        }, function(err, doc){
                            if (err) return console.err(err);
                            if (doc) {
                                socket.emit("reservationStatus", {
                                    message: "You already have a reservation at this time",
                                    success: false
                                });
                            }else{
                                var res = new FacilityReservation(data.res);
                                res.saveReservation(function(response){
                                    socket.emit("reservationStatus", {
                                        res: data.res,
                                        message: response.message,
                                        success: response.success
                                    });
                                    if(response.success) {
                                        socket.broadcast.emit("calendarHasChanged");
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    });
};
