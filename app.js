var  http = require('http') ;
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "/public"));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// route middleware that will happen on every request
app.use(function(req, res, next) {
    console.log("Middleware printing " + req.method, req.url);
    next();
});

//params middleware
app.all("*", function(req, res, next) {
    if (req.params && req.params.city) {
        console.log(req.params.city);
        req.params.city = req.params.city.replace('%20', '_');
    }
    next();
});

// handle home route
app.get('/', function (req, res) {
    routes.index(req, res, http);
});

// handle go to weather/state/city route
app.get('/weather/:state/:city', function (req, res) {
    console.log(' City=' + req.params.city + ' State='+ req.params.state);
    routes.weather(req, res, http);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;
