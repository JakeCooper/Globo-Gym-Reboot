var mongoose = require('mongoose');
var config = require('config');


module.exports = function (users, app) {
   
    app.get('/user', function(req,res,next){
        User.find(function(err,users){
            if (err) res.send(err);
            res.json(users);
        });
    
});
};
