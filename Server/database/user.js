var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

    photo: { type:String},
    email: {type:String},
    username: {type:String},
    facebookid:{type:String},
    googleid:{type:String}
    
    //lockedUntil:{type; date?} 
    //on create event: check lockedUntil date and if (inFuture == true) -> deny creation
    //on cancel event: if (timeUntilEvent < 24hrs) -> update lockedUntil to Xhrs from now
    
});

UserSchema.statics = {

    deserializeUser: function (id, callback){
        this.findOne({ _id: id }, function (err, user) {
            callback(err, user)
        })
    }
}

module.exports = mongoose.model('User', UserSchema);
