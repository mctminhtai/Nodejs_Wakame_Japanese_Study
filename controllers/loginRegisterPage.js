const models = require('../models');
// const regValidate = require('../validate_func/registerValidate');
const bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (username, password, done) {
        models.USER.findOne({
            attributes: ['email', 'password', 'id'],
            where: { email: username }
        }).then((user) => {
            if (user) {
                bcrypt.compare(password, user.dataValues.password).then((result) => {
                    console.log(result);
                    if (!result) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
            } else {
                return done(null, false);
            }
        });
    }
));
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, username, password, done) {
        models.USER.findOne({
            attributes: ['email', 'password', 'id'],
            where: { email: username }
        }).then((user) => {
            console.log(user);
            if (user) {
                return done(null, false);
            }
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                // Store hash in your password DB.
                models.USER.create({
                    fullName: req.body.name,
                    email: req.body.email,
                    password: hash
                }).then(user => {
                    return done(null, user);
                }).catch(error => {
                    console.log(error);
                })
            });
        });
    }
));
passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    models.USER.findByPk(id).then((user) => {
        return done(null, user);
    });
    // User.findById(id, function (err, user) {
    //     done(err, user);
    // });
});
exports.get_loginPage = function (req, res, next) {
    return res.render('login', { title: 'Express' });
}
// exports.post_loginPage = function (req, res, next) {
//     return models.USER.create({
//         email: req.body.login_email,
//         password: req.body.login_password
//     }).then(lead => {
//         res.redirect('/');
//     }).catch(error => {
//         console.log(error);
//     })
// }
exports.get_registerPage = function (req, res, next) {
    return res.render('register', { error: '' });
}
// exports.post_registerPage = function (req, res, next) {
//     data = req.body;
//     const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     models.USER.findAll({
//         attributes: ['email'],
//         where: { email: data.email }
//     }).then((allUsers) => {
//         let errors = [];
//         if (allUsers.length > 0) {
//             errors.push("Email này đã tồn tại");
//         }
//         if (!data.name) {
//             errors.push("Username không được để trống");
//         }
//         if (!re.test(data.email)) {
//             errors.push("Email không hợp lệ");
//         }
//         if (data.password != data.re_password) {
//             errors.push("Password1 và password2 không trùng nhau");
//         }
//         //console.log('kiem tra loi khong ve home', errors);
//         if (errors.length != 0) {
//             res.render('register', { errors: errors });
//         } else {
//             bcrypt.hash(req.body.password, 10, function (err, hash) {
//                 // Store hash in your password DB.
//                 models.USER.create({
//                     fullName: req.body.name,
//                     email: req.body.email,
//                     password: hash
//                 }).then(user => {
//                     res.redirect('/');
//                 }).catch(error => {
//                     console.log(error);
//                 })
//             });
//         }
//     });
// }
exports.get_logout = function (req, res, next) {
    req.logout();
    return res.redirect('/');
}
exports.get_test = async function (req, res, next) {

    // models.USER.findByPk(1, { include: ['baidang'] }).then((user) => {
    //     console.log(user.baidang);
    // })
    // models.USER.findOne({
    //     attributes: ['email', 'password'],
    //     where: { email: 'tai@gmail.com' }
    // }).then((user) => {
    //     console.log(user.dataValues.email);
    // })
    await models.USER.create({ fullName: 'minhtai33', email: 'minhtai@gmail.com', password: 'hahakakakak' });
    await models.TAG.create({ TEN_TAG: 'SuKien' });
    await models.TAG.create({ TEN_TAG: 'Thien thich jav' });
    await models.TAG.create({ TEN_TAG: 'Thien me dong JAv' });
    await models.TAG.create({ TEN_TAG: 'Thien coi jav' });
    await models.TAG.create({ TEN_TAG: 'Thien than tuong jav' });
    await models.TAG.create({ TEN_TAG: 'Thien sieu me JAV' });

    await models.BLOG.create({ USERId: 1, title: 'helo33', content: 'khong co giiii' });
    await models.TAG_BLOG.create({ TAGId:1 , BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 1 });
    await models.MONHOC.create({ TEN_MH: 'ĐẤM VỠ MÀN HÌNH', SO_TIN_CHI: 3 });
    await models.LOPHOC.create({ MONHOCId: 1 });
    await models.COMMENT.create({ USERId: 1, BLOGId: 1, cmcontent: 'met qua luon' });
    await models.THU.create({ TEN_THU: 'Thu 2' });
    await models.TIET.create({ TEN_TIET: 'Tiet 3' });
    await models.TIET_THU.create({ THUId: 1, TIETId: 1 });
    await models.GIANG_VIEN.create({ TEN_GV: 'God' });

    models.USER.findByPk(1, { include: ['binhluan'] }).then((user) => {
        console.log(user.binhluan);
    })

    users = []



    await models.USER.findAll({ attributes: ['fullName', 'email', 'password'] }).then((all) => {
        all.forEach((item, index) => {
            users.push(item.dataValues);
        })
        res.render('test', { users: users });
    });


}