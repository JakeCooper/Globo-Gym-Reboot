// this file attaches the connected user to the socket so that 
// the users information is readily available on the socket at
// any time
var User = require("mongoose").model("User");

module.exports = function(socket, next){
    var session = socket.handshake.session.passport

    // this will only continue if the user is logged in
    if(session){
        User.deserializeUser(session.user, function(err, user){
            if(!user) return;
            socket.user = user;
            next()
        });
    }
}
