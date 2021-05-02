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
var FacebookStrategy = require('passport-facebook').Strategy;
const { session } = require('passport');


passport.use(new FacebookStrategy({
    clientID: '1273803272829936',
    clientSecret: 'bdf4de8add92ebaf42d93e533cc44973',
    profileFields: ['email', 'displayName'],
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true,
},
    function (accessToken, refreshToken, req, profile, done) {
        console.log(profile._json.email);
        models.USER.findOne({
            where: { email: profile._json.email }
        }).then((user) => {
            if (user) {
                return done(null, user);
            } else {
                models.USER.create({
                    fullName: profile._json.name,
                    email: profile._json.email
                }).then((newUser) => {
                    console.log(newUser);
                    return done(null, newUser);
                });
            }
        });
    }
));
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (username, password, done) {
        models.USER.findOne({
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


exports.post_login = function (req, res, next) {
    var redirectTo = req.session.redirectTo || '/'
    passport.authenticate('local.login', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/accounts'); }
        if (user.actived) {
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                return res.redirect(redirectTo);
            });
        } else {
            models.PASSCODE.destroy({
                where: {
                    email: user.email,
                }
            });
            var randToken = randomString.password({
                length: 100,
                string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            });
            var randString = randomString.password({
                length: 6,
                string: "0123456789"
            });
            mailer.sendMail(user.email, 'Ma xac thuc WAKAME', randString);
            // models.PASSCODE.create({
            //     token: randToken,
            //     email: user.email,
            //     passcode: randString,
            // })
            req.session.active_info = {
                token: randToken,
                email: user.email,
                passcode: randString,
            }
            console.log('Ma xac thuc ' + randString);
            return res.redirect('/active?token=' + randToken);
        }
    })(req, res, next);
}
exports.post_register = function (req, res, next) {
    passport.authenticate('local.signup', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/accounts'); }
        var randToken = randomString.password({
            length: 100,
            string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        });
        var randString = randomString.password({
            length: 6,
            string: "0123456789"
        });
        mailer.sendMail(user.email, 'Ma xac thuc WAKAME', randString);
        // models.PASSCODE.create({
        //     token: randToken,
        //     email: user.email,
        //     passcode: randString,
        // })
        req.session.active_info = {
            token: randToken,
            email: user.email,
            passcode: randString,
        }
        console.log('Ma xac thuc ' + randString);
        return res.redirect('/active?token=' + randToken);
        // req.logIn(user, (err) => {
        //     if (err) { return next(err); }
        //     req.session.destroy();
        //     var randString = randomString.password({
        //         length: 100,
        //         string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        //     });
        //     return res.redirect('/active?q=' + randString);
        // });
    })(req, res, next);
}
exports.get_active = function (req, res, next) {
    return res.render('passcode');
}
exports.post_active = async function (req, res, next) {
    var redirectTo = req.session.redirectTo || '/';
    if (!req.query.token) {
        return res.redirect(redirectTo);
    }
    // var passcode_info = await models.PASSCODE.findOne({
    //     where: {
    //         token: req.query.token,
    //     }
    // })
    var passcode_info = req.session.active_info;
    var received_code = req.body.active_code || ''
    if (passcode_info.passcode != received_code) {
        return res.redirect('/active?token=' + req.query.token);
    } else {
        // models.PASSCODE.destroy({
        //     where: {
        //         token: passcode_info.token,
        //     }
        // });
        await models.USER.update({ actived: true }, {
            where: {
                email: passcode_info.email,
            }
        });
        var user = await models.USER.findOne({
            where: {
                email: passcode_info.email,
            },
        })
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect(redirectTo);
        });
    }
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
        // console.log(resetPwdUrl);
        mailer.sendMail(req.body.email, 'test thử email CLB', resetPwdUrl);
        // models.RESETTOKEN.create({
        //     token: randString,
        //     email: req.body.email,
        // });
        req.session.rsPwdToken = {
            token: randString,
            email: req.body.email,
        }
        console.log(req.session);
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
    // console.log(req.session);
    // savedToken = await models.RESETTOKEN.findOne({
    //     where: { token: received_token }
    // });
    var savedToken = req.session.rsPwdToken;
    if (savedToken.token == received_token) {
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
    // savedToken = await models.RESETTOKEN.findOne({
    //     where: { token: received_token }
    // });
    var savedToken = req.session.rsPwdToken;
    if (savedToken.token == received_token) {
        var hashPwd = bcrypt.hashSync(req.body.password, 10);
        models.USER.update(
            { password: hashPwd },
            {
                where: {
                    email: req.body.email,
                }
            }
        );
        // models.RESETTOKEN.destroy({
        //     where: {
        //         email: req.body.email,
        //     }
        // });
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
    res.sendStatus(200);
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
    // await models.USER.create({ fullName: 'minhtai33', actived: true, email: 'mct.minhtai@gmail.com', password: '$2a$10$VZZVEldp4B.FEFxP2uci9.3s.QiLEpC05m9aTbXa.v6tPzDlNLAmu' });
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
    /*
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
    */
    // await models.MONHOC.create({ TEN_MH: 'ĐẤM VỠ MÀN HÌNH', SO_TIN_CHI: 3 });
    // await models.LOPHOC.create({ MONHOCId: 1 });

    // await models.THU.create({ TEN_THU: 'Thu 2' });
    // await models.TIET.create({ TEN_TIET: 'Tiet 3' });
    // await models.TIET_THU.create({ THUId: 1, TIETId: 1 });
    await models.GIANGVIEN.create({ TEN_GV: 'God' });
    // await models.DS_LOP_HOC.create({ LOPHOCId: 1, GIANGVIENId: 1, THUId: 1, TIETId: 1 });
    // await models.TKB_DU_KIEN.create({ USERId: 1, LOPHOCId: 1, THUId: 1, TIETId: 1 });
    // await models.DS_MON_DA_HOC.create({ USERId: 1, MONHOCId: 1 });

    // models.USER.findByPk(1, { include: ['binhluan'] }).then((user) => {
    //     console.log(user.binhluan);
    // })
    await models.TAGKH.create({ TEN_TAG_KH: 'Abyss' });
    await models.KHOAHOC.create({ TENKH: 'No God Please', KH_IMG: 'Care', DESCRIPTION: 'No God Please,NOOO', SO_BAI_HOC: 15, THONG_TIN_KH: 'ABC', GIANGVIENId: '1' })
    await models.TAGKH_KHOAHOC.create({ KHOAHOCId: 1, TAGKHId: 1 });
    await models.CHUDEKH.create({ TEN_CHU_DE: 'Hello...' });
    await models.CHUDE_KHOAHOC.create({ KHOAHOCId: '1', CHUDEKHId: '1' });
    await models.BAIHOC.create({ KHOAHOCId: 1, TEN_BAI_HOC: 'Ranh Roi Sinh Nong Noi', LINK: 'xxx' })
    users = []
    await models.USER.findAll({ attributes: ['fullName', 'email', 'password'] }).then((all) => {
        all.forEach((item, index) => {
            users.push(item.dataValues);
        })
        res.render('test', { users: users });
    });


}