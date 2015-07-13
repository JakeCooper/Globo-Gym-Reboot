var mongoose = require('mongoose');
var config = require('config');

// see API/FacilityReservaton.md
var FacilityReservation = new mongoose.Schema({
    roomName: {type: String},
    type: {type: String},
    title: {type: String},
    start: {type: Date},
    end: {type: Date},
    user: {type: String},
    id: {type: String}
});

// Saves a reservtion, before a save the times are checked to be valid
// parameters,
//  callback({  // function
//     message: String,
//     success: Boolean,
//  })
FacilityReservation.methods.saveReservation = function (cb) {
    var that = this;
    that.model("FacilityReservation").findOne({
        type: that.type,
        roomName: that.roomName,
        $or: [
            { start: { $gte: that.start, $lt: that.end } },
            { end: { $gt: that.start, $lte: that.end } }
        ]
    }, function(err, res){
        // validate that the reservation if any of the following fail the message will be sent to the callback
        if(err)                     return console.err("Could not save to db", err, res);
        if(!that.isValidRoom())     return cb({message: "Invalid room"});
        if(that.isTooLong())        return cb({message: "This reservation is too long"});
        if(!that.isValidHours())    return cb({message: "The Facility is not open during this time"});
        if(res)                     return cb({message: "There is already a reservation with that time"});
        that.save(function(err){
            return cb({message: "Reservation booked", success: true});
        });
    });
};

// ==== Facility Reservation Authentication
// methods are attached to instances of a schema
// these methods are used to authenticate the facility schema is valid

// test the room and the type to make sure the reservation is valid
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

// checks if rervation is too long
FacilityReservation.methods.isTooLong = function () {
    return this.end.getTime() - this.start.getTime() > config.mongoose.maxLength * config.time.hourInMilliseconds;
}

// validates hours of the new reservation
FacilityReservation.methods.isValidHours = function () {
    // open and close are integers corresponding to the hour of the day the
    // facility opens and closes i.e. 8:00 would be 8am
    var open = config.mongoose.openTime;
    var close = config.mongoose.closeTime;
    // is the day sunday
    if(this.start.getDay() == 0){
        open = config.mongoose.sunOpenTime;
        close = config.mongoose.sunCloseTime;
    }
    var openTime = new Date(this.start)
    openTime.setHours(open);
    var closeTime = new Date(this.start)
    closeTime.setHours(close);
    return this.start >= openTime && this.end <= closeTime;
}

// ======== Static methods
// Static methods are attached to the schema and do not need an instance of the schemas to function
FacilityReservation.statics = {
    // given a users id, find all of thieir reservations in the database
    // parameters
    //      user
    //
    //      callback([ // function
    //          reservation, FacilityReservation // list of FacilityReservations
    //          ...
    //      ])
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
