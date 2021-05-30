// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

var redis = require("redis");
var redisStore = require('connect-redis')(session);
var redisClient = redis.createClient(process.env.REDIS_URL);
//process.env.REDIS_URL

var homePageRouter = require('./routes/homePage');
var loginRegisterRouter = require('./routes/loginRegister');
var adminRouter = require('./routes/adminPages');
var blogRouter = require('./routes/blogPages');

var webhookRouter = require('./routes/webhook');

var app = express();
var PORT = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join('public')));
app.use(session({
  secret: 'keyboard cat',
  store: new redisStore({
    host: 'localhost',
    port: 6379,
    client: redisClient
  }),
  saveUninitialized: false,
  resave: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', homePageRouter);
app.use('/', blogRouter);
app.use('/', loginRegisterRouter);
app.use('/', adminRouter);

app.use('/webhook', webhookRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || PORT, () => {
  console.log("===============================================")
  console.log(`Example app listening at http://127.0.0.1:${PORT}`)
  console.log("===============================================")
})
module.exports = app;
