module.exports = function (socket, next) {
    socket.emit("sample", { sample: "This is from the server"});
    console.log("should be next");
    next();
}
