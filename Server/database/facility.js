var mongoose = require('mongoose');
var config = require('config');

var FacilityReservation = new mongoose.Schema({
    roomName: {type: String},
    type: {type: String},
    title: {type: String},
    start: {type: Date},
    end: {type: Date},
    user: {type: String},
    id: {type: String}
});

FacilityReservation.methods.saveReservation = function (cb) {
    var that = this;
    if(!that.isValidRoom()) return cb({message: "Invalid room"});
    if(that.isTooLong()) return cb({message: "This reservation is too long"});
    if(that.isValidHours()) return cb({message: "The Facility is not open during this time"});
    var options = {
        type: that.type,
        roomName: that.roomName,
        $or: [
            { start: { $gte: that.start, $lt: that.end } },
            { end: { $gt: that.start, $lte: that.end } }
        ]
    };

    that.model("FacilityReservation").findOne(options, function(err, res){
        if(err) return console.err("Could not save to db", err, res);
        if(res) return cb({message: "There is already a reservation with that time"});
        //if()
        that.save(function(err){
            return cb({message: "it has been done", success: true});
        });
    });
};


FacilityReservation.methods.isValidRoom = function(){
    var roomName = this.roomName;
    var type = this.type;

    var isValidRoomName = function(room){
        var rooms = config.mongoose.facility.rooms;
        return !!rooms[roomName];
    };

    var isValidType = function(room, type){
        var typeList = config.mongoose.facility.types;
        return !!typeList[type] && !!typeList[type][room];
    };

    return isValidRoomName(roomName) && isValidType(roomName, type);
};

FacilityReservation.methods.findSimilarRooms = function (cb) {
    return this.model('FacilityReservation').find({ type: this.type }, cb);
};

FacilityReservation.methods.isTooLong = function () {
    // 1 h = 3600000 ms
    return this.end.getTime() - this.start.getTime() > this.constructor.maxLength * 3600000;
}

FacilityReservation.methods.isValidHours = function () {
    var open = this.constructor.closeTime;
    var close = this.constructor.openTime;
    // is the day sunday
    if(this.start.getDay() == 0){
        open = this.constructor.sunOpenTime;
        close = this.constructor.sunCloseTime;
    }
    var openTime = new Date(this.start)
    openTime.setHours(open);
    var closeTime = new Date(this.start)
    closeTime.setHours(close);
    return this.start > openTime && this.end < closeTime;
}

FacilityReservation.methods.findThisRoomsReservations = function (cb) {
    return this.model('FacilityReservation').find({ roomName: this.roomName }, cb);
};

FacilityReservation.statics = {
    maxLength: config.mongoose.maxLength,
    minCancelTime: config.mongoose.minCancelTime,
    openTime: config.mongoose.openTime,
    closeTime: config.mongoose.closeTime,
    sunOpenTime: config.mongoose.sunOpenTime,
    sunCloseTime: config.mongoose.sunCloseTime,
    rooms: config.mongoose.facility.rooms,

    getUserEvents: function(user, cb){
        this.model("FacilityReservation").find({
            id: user.id
        }, function(err, res){
            if(err) console.err("No reseervation");
            cb(res);
        });
    }
};

module.exports = mongoose.model('FacilityReservation', FacilityReservation);
