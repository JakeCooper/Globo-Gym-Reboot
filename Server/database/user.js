var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    reservation: { type: Array },
    //name: { type: String},
    provider: { type: String },
    info: {},
    google: {
        // need to put some shit in here once we decide on a structure
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
});

UserSchema.statics = {

    deserializeUser: function (id, callback){
        this.findOne({ _id: id }, function (err, user) {
            callback(err, user)
        })
    }
}

module.exports = mongoose.model('User', UserSchema);
