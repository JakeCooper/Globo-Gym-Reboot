module.exports = function (server) {
    var passport = require("passport");
    var config = require('config');
    var io = require("socket.io")(server)

    // authenticate sockets
    io.use(function (socket, next) {
        // requires the application to be initialized
        // this is not stored in the config file
        config.sessionMiddleware(socket.handshake, {}, next);
    });

    // will only continue on if the user is logged in
    io.use(require("./authorizeSockets.js"));
    // form her on out we should put all the socket logic into separate files
    io.use(require("./socketLogic.js"));
}
