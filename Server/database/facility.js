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

FacilityReservation.methods.isValidRoom = function(){
    var rooms = this.constructor.rooms;
    for(var i = 0; i < rooms.length; i++){
        var room = rooms[i];
        console.log(this.roomName, room.roomName ,this.type ,room.type);
        if(this.roomName.trim() == room.roomName && this.type.trim() == room.type){
            return true
        }
    }
    return false;
};

FacilityReservation.methods.findSimilarRooms = function (cb) {
    return this.model('FacilityReservation').find({ type: this.type }, cb);
};

FacilityReservation.methods.isTooLong = function () {
    var startHour = this.getStartHours();
    var endHour = this.getEndHours();
    console.log(startHour, endHour)
    return endHour - startHour > this.constructor.maxLength
}

FacilityReservation.methods.getStartHours = function () {
    return this.start.getHours() + (this.start.getMinutes()/30) * 0.5;
}

FacilityReservation.methods.getEndHours = function () {
    var end = this.end.getHours() == 0 ? 24 : this.end.getHours();
    return end + this.end.getMinutes()/30 * 0.5;
}

FacilityReservation.methods.isFacilityOpen = function () {
    var open = this.constructor.closeTime;
    var close = this.constructor.openTime;
    // is the day sunday
    if(this.start.getDay() == 0){
        open = this.constructor.sunOpenTime;
        close = this.constructor.sunCloseTime;
    }
    return this.start.getHours() >= open && this.getEndHours() <= close;
}

FacilityReservation.methods.saveReservation = function (cb) {
    var that = this;
    if(that.isValidRoom()){
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
            console.log("hey baby")
            if(that.isTooLong()) return cb({message: "This reservation is too long"});
            //if()
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
    maxLength: config.mongoose.maxLength,
    minCancelTime: config.mongoose.minCancelTime,
    openTime: config.mongoose.openTime,
    closeTime: config.mongoose.closeTime,
    sunOpenTime: config.mongoose.sunOpenTime,
    sunCloseTime: config.mongoose.sunCloseTime,
    rooms: config.mongoose.facility.rooms,
};

module.exports = mongoose.model('FacilityReservation', FacilityReservation);
