// Sockets handle asnynous data transfer they are used heaviliy in this project
// The socket uses passports api to attach a user to each incoming socket
// this user is accessable using socket.user
// handles the importing of all the socket logic, see socketLogic.js for a template
//
module.exports = function (server) {
    var config = require('config');
    // attach sockets to the server
    var io = require("socket.io")(server);

    // get the session information from mongo
    var mongoose = require('mongoose');;
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);

    var sess = config.sess;
    // store sessions in mongoose instead of memory
    sess.store =  new MongoStore({
        mongooseConnection: mongoose.connection
    })
    var sessionMiddleware = session(config.sess);

    // authenticate sockets
    io.use(function (socket, next) {
        sessionMiddleware(socket.handshake, {}, next);
    });

    io.use(require("./authorizeSockets.js"));
    require("./socketCalendar.js")(io.sockets);
    require("./socketUser.js")(io.sockets);
    require("./socketProfilePic.js")(io.sockets);
    // This is how you add a new socket file
    //require("./socketLogic.js")(io.sockets);
}
