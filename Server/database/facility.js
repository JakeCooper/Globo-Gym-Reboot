var mongoose = require('mongoose');

var FacilityReservation = new mongoose.Schema({
    roomName: {type: String},
    type: {type: String},
    title: {type: String},
    start: {type: Date},
    end: {type: Date},
    user: {type: String}
});

FacilityReservation.statics = {
    findSimilarRooms: function (cb) {
          return this.model('Animal').find({ type: this.type }, cb);
    }
}

module.exports = mongoose.model('FacilityReservation', FacilityReservation);
