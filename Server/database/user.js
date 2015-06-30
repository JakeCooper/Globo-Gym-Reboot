var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: {unique: true} },
    email: { type: String },
    reservation: { type: Array },
    name: { type: String},
    email: { type: String },
    username: { type: String },
    provider: { type: String },
    info: {},
    google: {}
});

module.exports = mongoose.model('User', UserSchema);
