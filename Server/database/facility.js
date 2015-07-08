var mongoose = require('mongoose');
var config = require('config');

var FacilityReservation = new mongoose.Schema({
    roomName: {type: String},
    type: {type: String},
    title: {type: String},
    start: {type: Date},
    end: {type: Date},
    user: {type: String}
});

var rooms = config.mongoose.facility.rooms;

FacilityReservation.methods.isValidRoom = function(){
    for(var i = 0; i < rooms.length; i++){
        var room = rooms[i];
        if(this.roomName == room.roomName && this.type == room.type){
            return true
        }
    }
    return false;
};

FacilityReservation.methods.findSimilarRooms = function (cb) {
    return this.model('FacilityReservation').find({ type: this.type }, cb);
};

FacilityReservation.methods.saveReservation = function (cb) {
    var that = this;
    if(that.isValidRoom()){
        var options = {
            type: that.type,
            roomName: that.roomName,
            $or: [
                { start: { $gte: that.start, $lte: that.end } },
                { end: { $gte: that.start, $lte: that.end } }
            ]
        }

        that.model("FacilityReservation").findOne(options, function(err, res){
            if(err) return console.err("Could not save to db", err, res);
            if(res) return cb({message: "There is already a reservation with that time"});
            that.save(function(err){
                return cb({message: "it has been done"});
            });
        });
    } else {
        return cb({message: "Invalid room"});
    }
};

FacilityReservation.methods.findThisRoomsReservations = function (cb) {
    return this.model('FacilityReservation').find({ roomName: this.roomName }, cb);
};

FacilityReservation.statics = {
};

module.exports = mongoose.model('FacilityReservation', FacilityReservation);
