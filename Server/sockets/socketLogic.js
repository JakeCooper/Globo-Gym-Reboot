module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.emit("sample", { sample: "This is from the server"});
        console.log("should be next")
    });
}
