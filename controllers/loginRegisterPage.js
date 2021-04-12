const models = require('../models');
var svgCaptcha = require('svg-captcha');
const bcrypt = require('bcryptjs');
var passport = require('passport');
//add ham gui email
var mailer = require('../utils/mailer');

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
});
exports.get_accountsPage = function (req, res, next) {
    return res.render('login_register');
}



exports.get_logout = function (req, res, next) {
    req.logout();
    return res.redirect('/');
}
exports.get_captcha = function (req, res, next) {
    var captcha = svgCaptcha.create();
    //console.log(captcha);
    //mailer.sendMail('tailm0796@gmail.com', 'test thử email CLB', 'không có gì đâu nha');
    return res.render('captcha', { captcha: captcha.data });
}
exports.post_captcha = function (req, res, next) {
    console.log(req.body);
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
    //await models.USER.create({ fullName: 'minhtai33', email: 'minhtai@gmail.com', password: 'hahakakakak' });
    // await models.TAG.create({ TEN_TAG: 'SuKien' });
    // await models.TAG.create({ TEN_TAG: 'Thien thich jav' });
    // await models.TAG.create({ TEN_TAG: 'Thien me dong JAv' });
    // await models.TAG.create({ TEN_TAG: 'Thien coi jav' });
    // await models.TAG.create({ TEN_TAG: 'Thien than tuong jav' });
    // await models.TAG.create({ TEN_TAG: 'Thien sieu me JAV' });

    // await models.BLOG.create({ USERId: 1, title: 'helo33', content: 'khong co giiii' });
    // await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 1 });
    // await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 1 });
    // await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 1 });
    // await models.MONHOC.create({ TEN_MH: 'ĐẤM VỠ MÀN HÌNH', SO_TIN_CHI: 3 });
    // await models.LOPHOC.create({ MONHOCId: 1 });
    // await models.COMMENT.create({ USERId: 1, BLOGId: 1, cmcontent: 'met qua luon' });
    // await models.THU.create({ TEN_THU: 'Thu 2' });
    // await models.TIET.create({ TEN_TIET: 'Tiet 3' });
    // await models.TIET_THU.create({ THUId: 1, TIETId: 1 });
    // await models.GIANGVIEN.create({ TEN_GV: 'God' });
    // await models.DS_LOP_HOC.create({ LOPHOCId: 1, GIANGVIENId: 1, THUId: 1, TIETId: 1 });
    // await models.TKB_DU_KIEN.create({ USERId: 1, LOPHOCId: 1, THUId: 1, TIETId: 1 });
    // await models.DS_MON_DA_HOC.create({ USERId: 1, MONHOCId: 1 });

    // models.USER.findByPk(1, { include: ['binhluan'] }).then((user) => {
    //     console.log(user.binhluan);
    // })

    users = []
    await models.USER.findAll({ attributes: ['fullName', 'email', 'password'] }).then((all) => {
        all.forEach((item, index) => {
            users.push(item.dataValues);
        })
        res.render('test', { users: users });
    });


}