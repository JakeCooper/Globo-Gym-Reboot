var User = require("mongoose").model("User");

module.exports = function(socket, next){

    var session = socket.handshake.session.passport

    if(session){
        User.deserializeUser(session.user, function(err, user){
            if(!user) return;
            socket.user = user;
            next()
        });
    }
}
