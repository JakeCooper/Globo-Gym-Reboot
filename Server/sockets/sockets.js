module.exports = function (server) {
    var passport = require("passport");
    var config = require('config');
    var io = require("socket.io")(server)

    // authenticate sockets
    io.use(function (socket, next) {
        // requires the application to be initialized
        // this is not stored in the config file
        // XXX needs to be changed before we go into production
        config.sessionMiddleware(socket.handshake, {}, next);
    });

    io.use(require("./authorizeSockets.js"));
    require("./socketCalendar.js")(io.sockets);
    require("./socketLogic.js")(io.sockets);

    io.on("connection", function(socket){
        // will only continue on if the user is logged in
        // form her on out we should put all the socket logic into separate files
        var mongoose = require('mongoose');
        var FacilityReservation = mongoose.model("FacilityReservation");
    })
}
