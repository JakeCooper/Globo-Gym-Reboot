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

FacilityReservation.statics = {
    rooms: config.mongoose.facility.rooms,

    isValidRoom: function(){
        for(var i = 0; i < this.rooms.length; i++){
            var room = this.rooms[i];
            if(this.roomName == room.roomname && this.type == room.type){
                
            }
        }
    },

    findSimilarRooms: function (cb) {
          return this.model('FacilityReservation').find({ type: this.type }, cb);
    },

    findThisRoomsReservations: function (cb) {
          return this.model('FacilityReservation').find({ roomName: this.roomName }, cb);
    }
};

module.exports = mongoose.model('FacilityReservation', FacilityReservation);
