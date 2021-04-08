//Tiên đã ở đây
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
var redisClient = redis.createClient();
//process.env.REDIS_URL


var homePageRouter = require('./routes/homePage');
var loginRegisterRouter = require('./routes/loginRegister');
var webhookRouter = require('./routes/webhook');







var app = express();
var PORT = 3000



//sua loi


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
app.use('/', loginRegisterRouter);

app.use('/webhook', webhookRouter);

//tui da sua cho nay
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










// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize('expressjsdb', 'postgres', '1234567890', {
//   host: 'localhost',
//   dialect: 'postgres'
// });



// class User extends Model { }

// User.init(
//   {
//     firstName: { type: DataTypes.STRING, allowNull: false },
//     lastName: { type: DataTypes.STRING }
//   },
//   { sequelize, modelName: 'User', timestamps: false }
// );

// function dbmanager() {
//   User.sync({ force: true });
//   console.log('da tao db');
//   // User.drop();
//   // console.log('da xoa db');
// }
// dbmanager();

// khoi tao doi tuong va luu doi tuong duoc tach rieng lam 2 buoc
// const tai = User.build({ firstName: 'minh', lastName: 'tai' });
// console.log(tai.lastName);
// tai.save();

//khoi tao doi tuong va luu doi tuong duoc gom chung thanh 1 buoc
// const tai = User.create({ firstName: 'minh', lastName: 'tai' });
// console.log(tai);




//xoa doi tuong khoi database
// const tai = User.create({firstName:'minh',lastName:'tai'});
// tai.destroy();


//reload doi tuong tu database
// const tai = User.create({firstName:'minh',lastName:'tai'});
// tai.lastName = 'anh';
// the name is still "Jane" in the database
// tai.reload(); //last name da duoc reset lai thanh 'tai'


//luu lai cot duoc chi dinh
// tai.save({fields: ['firstName']});




//chuyen thong tin cua doi tuong qua json
// const tai = User.build({ firstName: 'minh', lastName: 'tai' });
// console.log(tai.toJSON());
//hoac
// console.log(JSON.stringifu(tai,null,2));




//SELECT tat ca User va lay tat ca cac field
// SELECT * FROM ...
// const users = User.findAll();

//SELECT foo, bar FROM ...
// User.findAll({attributes: ['firstName','lastName']});

// SELECT * FROM post WHERE authorId = 2
//Post.findAll({where:{authorId:2,status:'active'}});
//hoac
//Post.findAll({where:{[Op.and]:[{authorID:12},{authorID:13}]}});



































app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
module.exports = app;
