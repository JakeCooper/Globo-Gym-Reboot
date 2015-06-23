// Sexy ES6 arrow functions!
module.exports = (io) => {
    io.on('connection', (client) => {
        client.emit("sample", { sample: "This is from the server"});
    });
}
