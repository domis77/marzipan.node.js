var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var email = require('./routes/email');
var s3 = require('./routes/s3');


var app = express();
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));   >--DEV--<
app.use(express.static(path.join(__dirname, 'build')));

// Add for static serve
// app.use('/', express.static(__dirname + '/public'));   >--DEV--<
// app.use("/", express.static(__dirname));    >--DEV--<


app.use('/', express.static(__dirname + '/build'));
app.use("/", express.static(__dirname));

app.use('/email', email);
app.use('/s3', s3());





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
