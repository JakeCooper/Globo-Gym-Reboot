module.exports = function (io) {
    io.on('connection', function (client) {
        client.emit("sample", { sample: "This is from the server"});
    });
}
