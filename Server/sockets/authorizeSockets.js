var User = require("mongoose").model("User");

module.exports = function(socket, next){
    // All I cam say is that passport is literally the stupidest thing I have ever seen
    // So the session is stores in a session object and is saved under the key called sessionID
    // But then the data contained within the sessionID key is a string of JSON.... Did you hear
    // what I just said.... A STRING OF JSON
    // So you have to parse the string, but thats not all.. Even if you get a session the
    // passport object contained within that object may be empty. So you then have to checck for that
    // It was really the worst
    var sessionID = socket.handshake.sessionID;

    var session = JSON.parse(
        ((((socket.handshake || {})
        .sessionStore || {})
        .sessions || {})
        [sessionID])
        ||  "{}");

    if(session.passport){
            //for(item in session){if(session.hasOwnProperty(item)){console.log(item)}}
        User.deserializeUser(session.passport.user, function(err, user){

            if(!user) return;
            socket.user = user;
            next()
        });
    }
}
