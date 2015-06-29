var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: {unique: true}},
    email: { type: String, required: true},
    info: { type: String, select: false},
    reservation: { type: Array, required: true  }
});

module.exports = mongoose.model('User', UserSchema);
