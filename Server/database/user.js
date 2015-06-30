var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    //username: { type: String, required: true, index: {unique: true} },
    reservation: { type: Array },
    name: { type: String},
    provider: { type: String },
    info: {},
    google: {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
});

module.exports = mongoose.model('User', UserSchema);
