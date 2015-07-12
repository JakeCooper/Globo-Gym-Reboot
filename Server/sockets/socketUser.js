module.exports = function (sockets) {
    
    var mongoose = require('mongoose');
    var UsersInfo = mongoose.model("User");
    var config = require('config')
    
    //console.log(mongoose.model("FacilityReservation")) 
    sockets.on("connection", function(socket){
          socket.on("getUsers", function(data){
              UsersInfo.find({}, function(err, users){ 
              var theUsers = users
                socket.emit("getUsers", users);

            });
        });
        
        socket.on("banUser", function(user){
           
            UsersInfo.findOne({_id:user._id},function(err, doc){
                console.log(doc)
                doc.isbanned = user.isbanned
                doc.save()
                              
                              })


        });  
    });
};
