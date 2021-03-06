var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect(config.mongoose.URL);

var sess = config.sess
sess.store =  new MongoStore({
    mongooseConnection: mongoose.connection
})

var sessionMiddleware = session(config.sess);

var app = express();

//config =========
require('./database/schemas.js');

// view engine setup
app.set('views', path.join(__dirname, '../Frontend'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/../Frontend/assets/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(sessionMiddleware);

// authenticate the user using passport
require('./passport/passport.js')(passport, app)

// This is all the routing we need the server to do
// render the partials and send 404 errors, otherwise angular will do the routing

// default to the index page let angular do the routing
app.get('/', function(req, res, next){
    res.render('../Frontend/index');
});

// render the partials as angular requests them
app.get('/partials/:filename', function(req, res, next) {
    res.render('../Frontend/partials/' + req.params.filename);
});

// default to the index page let angular do the routing
app.get('/app/*', function(req, res, next){
    res.render('../Frontend/index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
