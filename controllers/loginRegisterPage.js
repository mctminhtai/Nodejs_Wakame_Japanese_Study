const models = require('../models');
// const regValidate = require('../validate_func/registerValidate');
const bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (username, password, done) {
        models.User.findOne({
            attributes: ['email', 'password', 'id'],
            where: { email: username }
        }).then((user) => {
            bcrypt.compare(password, user.dataValues.password).then((result) => {
                console.log(result);
                if (!result) {
                    return done(null, false);
                }
                console.log('kiem tra loi 500', user);
                return done(null, user);
            });
        });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    models.User.findByPk(id).then((user) => {
        done(null, user);
    });
    // User.findById(id, function (err, user) {
    //     done(err, user);
    // });
});
exports.get_loginPage = function (req, res, next) {
    res.render('login', { title: 'Express' });
}
// exports.post_loginPage = function (req, res, next) {
//     return models.User.create({
//         email: req.body.login_email,
//         password: req.body.login_password
//     }).then(lead => {
//         res.redirect('/');
//     }).catch(error => {
//         console.log(error);
//     })
// }
exports.get_registerPage = function (req, res, next) {
    res.render('register', { error: '' });
}
exports.post_registerPage = function (req, res, next) {
    data = req.body;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    models.User.findAll({
        attributes: ['email'],
        where: { email: data.email }
    }).then((allUsers) => {
        let errors = [];
        if (allUsers.length > 0) {
            errors.push("Email này đã tồn tại");
        }
        if (!data.name) {
            errors.push("Username không được để trống");
        }
        if (!re.test(data.email)) {
            errors.push("Email không hợp lệ");
        }
        if (data.password != data.re_password) {
            errors.push("Password1 và password2 không trùng nhau");
        }
        //console.log('kiem tra loi khong ve home', errors);
        if (errors.length != 0) {
            res.render('register', { errors: errors });
        } else {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                // Store hash in your password DB.
                models.User.create({
                    fullName: req.body.name,
                    email: req.body.email,
                    password: hash
                }).then(user => {
                    res.redirect('/');
                }).catch(error => {
                    console.log(error);
                })
            });
        }
    });
}
exports.get_logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}
exports.get_test = function (req, res, next) {
    users = []
    models.User.findAll({ attributes: ['fullName', 'email', 'password'] }).then((all) => {
        all.forEach((item, index) => {
            users.push(item.dataValues);
        })
        res.render('test', { users: users });
    });
    // models.User.findOne({
    //     attributes: ['email', 'password'],
    //     where: { email: 'tai@gmail.com' }
    // }).then((user) => {
    //     console.log(user.dataValues.email);
    // })
}