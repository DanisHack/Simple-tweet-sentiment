var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sentiment = require("sentiment");

var routes = require('./routes');
var users = require('./routes/user');

var app = express();
var port = (process.env.VCAP_APP_PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);

/// catch 404 and forwarding to error handler
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.get('/testSentiment',function (req, res) {
    var response = "<HEAD>" +
      "<title>Twitter Sentiment Analysis</title>\n" +
      "</HEAD>\n" +
      "<BODY>\n" +
      "<P>\n" +
      "Welcome to the Twitter Sentiment Analysis app.  " +   
      "What phrase would you like to analzye?\n" +                
      "</P>\n" +
      "<FORM action=\"/testSentiment\" method=\"get\">\n" +
      "<P>\n" +
      "Enter a phrase to evaluate: <INPUT type=\"text\" name=\"phrase\"><BR>\n" +
      "<INPUT type=\"submit\" value=\"Send\">\n" +
      "</P>\n" +
      "</FORM>\n" +
      "</BODY>";
    var phrase = req.query.phrase;
    if (!phrase) {
        res.send(response);
    } else {
        sentiment(phrase, function (err, result) {
            response = 'sentiment(' + phrase + ') === ' + result.score;
            res.send(response);
        });
    }
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port);
console.log("Server listening on port " + port);

module.exports = app;
