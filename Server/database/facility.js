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
        console.log(this.roomName,room.roomName,this.type,room.type);
        if(this.roomName == room.roomName && this.type == room.type){
            return true
        }
    }
    return false;
},

FacilityReservation.methods.findSimilarRooms = function (cb) {
      return this.model('FacilityReservation').find({ type: this.type }, cb);
},

FacilityReservation.methods.findThisRoomsReservations = function (cb) {
      return this.model('FacilityReservation').find({ roomName: this.roomName }, cb);
}

FacilityReservation.statics = {
};

module.exports = mongoose.model('FacilityReservation', FacilityReservation);
