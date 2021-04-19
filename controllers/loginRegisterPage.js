const models = require('../models');
var svgCaptcha = require('svg-captcha');
const bcrypt = require('bcryptjs');
var passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const randostring = require('randostrings/server');
let randomString = new randostring();
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
                    //console.log(user.email, req.body.email);
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
exports.get_resetToken = function (req, res, next) {
    res.render('sendToken_login');
}
exports.post_resetToken = async function (req, res, next) {
    storedEmail = await models.USER.findOne({
        where: {
            email: req.body.email,
        }
    });
    if (storedEmail) {
        var randString = randomString.password({
            length: 100,
            string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        });
        var resetPwdUrl = req.headers.origin + '/pwd_reset' + '/' + randString;
        console.log(resetPwdUrl);
        mailer.sendMail(req.body.email, 'test thử email CLB', resetPwdUrl);
        models.RESETTOKEN.create({
            token: randString,
            email: req.body.email,
        });
        res.render('sendToken_login', {
            noti: 'Đã gửi email reset mật khẩu thành công',
        });
    } else {
        res.render('sendToken_login', {
            noti: 'email không tồn tại',
        });
    }

}
exports.get_resetPwd = async function (req, res, next) {
    var received_token = req.param('token');
    savedToken = await models.RESETTOKEN.findOne({
        where: { token: received_token }
    });
    if (savedToken) {
        res.render('resetPwd_login', {
            token: savedToken.token,
            email: savedToken.email,
        });
    } else {
        res.send('token khong dung');
    }
}
exports.post_resetPwd = async function (req, res, next) {
    var received_token = req.param('token');
    savedToken = await models.RESETTOKEN.findOne({
        where: { token: received_token }
    });
    if (savedToken) {
        var hashPwd = bcrypt.hashSync(req.body.password, 10);
        models.USER.update(
            { password: hashPwd },
            {
                where: {
                    email: req.body.email,
                }
            }
        );
        models.RESETTOKEN.destroy({
            where: {
                email: req.body.email,
            }
        });
        res.redirect('/accounts');
    } else {
        res.send('token khong dung');
    }
}
exports.get_captcha = function (req, res, next) {
    var captcha = svgCaptcha.create();
    //console.log(captcha);
    //mailer.sendMail('tailm0796@gmail.com', 'test thử email CLB', 'không có gì đâu nha');
    console.log(uuidv4());
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
    await models.USER.create({ fullName: 'minhtai33', email: 'mct.minhtai@gmail.com', password: '$2a$10$VZZVEldp4B.FEFxP2uci9.3s.QiLEpC05m9aTbXa.v6tPzDlNLAmu' });
    // await models.USER.create({ fullName: 'VietAnhJav', email: 'JavIsNumberOne@gmail.com', password: 'vietanh' });
    // await models.USER.create({ fullName: 'VietAnhLoveJAV', email: 'JavIsNumber1@gmail.com', password: 'vietanh' });
    await models.TAG.create({ TEN_TAG: 'SuKien' });
    await models.TAG.create({ TEN_TAG: 'Viet Anh JAV' });
    await models.TAG.create({ TEN_TAG: 'JAV is Viet Anh life' });
    await models.TAG.create({ TEN_TAG: 'Viet Anh Love JAV' });
    await models.TAG.create({ TEN_TAG: 'Viet Anh hontoni JAV wo aishiteiru' });
    await models.TAG.create({ TEN_TAG: 'Viet Anh la fan cua Tokuda' });
    await models.CATEGORY.create({ name: 'la la la' });
    await models.CATEGORY.create({ name: 'ha ha ha' });
    await models.CATEGORY.create({ name: 'ho ho ho' });
    await models.BLOG.create({
        uuid: uuidv4(),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Multiply sea night grass fourth day sea lesser rule open subdue female fill which them Blessed, give fill lesser bearing multiply sea night grass fourth day sea lesser',
        title: '商業施設など集客するイベント系全て1年休業要請商業施設など集客するイベン',
        content: 'khong co giiii',
        blogimg: 'https://seido.vn/wp-content/uploads/2020/12/Colorful-Geometric-Simple-Background-Image.jpg'
    });
    await models.BLOG.create({
        uuid: uuidv4(),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Multiply sea night grass fourth day sea lesser rule open subdue female fill which them Blessed, give fill lesser bearing multiply sea night grass fourth day sea lesser',
        title: '商業施設など集客するイベント系全て1年休業要請商業施設など集客するイベン',
        content: 'khong co giiii',
        blogimg: 'https://seido.vn/wp-content/uploads/2020/12/Colorful-Geometric-Simple-Background-Image.jpg'
    });
    await models.BLOG.create({
        uuid: uuidv4(),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Multiply sea night grass fourth day sea lesser rule open subdue female fill which them Blessed, give fill lesser bearing multiply sea night grass fourth day sea lesser',
        title: '商業施設など集客するイベント系全て1年休業要請商業施設など集客するイベン',
        content: 'khong co giiii',
        blogimg: 'https://seido.vn/wp-content/uploads/2020/12/Colorful-Geometric-Simple-Background-Image.jpg'
    });
    await models.BLOG.create({
        uuid: uuidv4(),
        USERId: 1,
        CATEGORYId: 2,
        description: 'Multiply sea night grass fourth day sea lesser rule open subdue female fill which them Blessed, give fill lesser bearing multiply sea night grass fourth day sea lesser',
        title: '商業施設など集客するイベント系全て1年休業要請商業施設など集客するイベン',
        content: 'khong co giiii',
        blogimg: 'https://seido.vn/wp-content/uploads/2020/12/Colorful-Geometric-Simple-Background-Image.jpg'
    });
    await models.BLOG.create({
        uuid: uuidv4(),
        USERId: 1,
        CATEGORYId: 2,
        description: 'Multiply sea night grass fourth day sea lesser rule open subdue female fill which them Blessed, give fill lesser bearing multiply sea night grass fourth day sea lesser',
        title: '商業施設など集客するイベント系全て1年休業要請商業施設など集客するイベン',
        content: 'khong co giiii',
        blogimg: 'https://seido.vn/wp-content/uploads/2020/12/Colorful-Geometric-Simple-Background-Image.jpg'
    });

    await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 1 });
    await models.COMMENT.create({
        USERId: 1,
        BLOGId: 1,
        cmcontent: 'bai viet qua hay',
    })
    await models.COMMENT.create({
        USERId: 1,
        BLOGId: 1,
        cmcontent: 'met qua luon',
    });
    // await models.MONHOC.create({ TEN_MH: 'ĐẤM VỠ MÀN HÌNH', SO_TIN_CHI: 3 });
    // await models.LOPHOC.create({ MONHOCId: 1 });

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