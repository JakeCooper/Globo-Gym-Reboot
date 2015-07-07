module.exports = function (sockets) {
    sockets.on("connection", function(socket){
        socket.on("getProfile", function(){
            socket.emit("profileInfo", socket.user);
        })
    });
}
