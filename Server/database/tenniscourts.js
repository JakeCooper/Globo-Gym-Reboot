var mongoose = require('mongoose');
var FacilityReservation = mongoose.model("FacilityReservation");

var tennisCourt1 = new FacilityReservation({
    type: "tennisCourt",
    roomName: "The White Goodman Tennis Room"
});

var tennisCourt2 = new FacilityReservation({
    type: "tennisCourt",
    roomName: "Me'Shell Jones Tennis Room"
});
