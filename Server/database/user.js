var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    photo: { type:String},
    email: {type:String},
    username: {type:String},
    facebookid:{type:String},
    googleid:{type:String},
    isadmin:{type:Boolean},
    isbanned:{type:Boolean},
    bannedUntil: {type: Date}
});

UserSchema.statics = {
    // used to unpack the user for passport
    deserializeUser: function (id, callback){
        this.findOne({ _id: id }, function (err, user) {
            callback(err, user)
        })
    }
};

module.exports = mongoose.model('User', UserSchema);
