const models = require('../models');
var svgCaptcha = require('svg-captcha');
const bcrypt = require('bcryptjs');
var passport = require('passport');

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
        req.session.user_email = user.email;
        if (user.actived) {
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                return res.redirect(redirectTo);
            });
        } else {
            var randToken = randomString.password({
                length: 100,
                string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            });
            var randString = randomString.password({
                length: 6,
                string: "0123456789"
            });
            mailer.sendMail(user.email, 'Ma xac thuc WAKAME', randString);
            req.session.active_info = {
                token: randToken,
                email: user.email,
                passcode: randString,
            }
            req.session.failPasscode = 0;
            console.log('Ma xac thuc ' + randString);
            return res.redirect('/active?token=' + randToken);
        }
    })(req, res, next);
}
exports.post_register = function (req, res, next) {
    passport.authenticate('local.signup', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/accounts'); }
        req.session.user_email = user.email;
        var randToken = randomString.password({
            length: 100,
            string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        });
        var randString = randomString.password({
            length: 6,
            string: "0123456789"
        });
        mailer.sendMail(user.email, 'Ma xac thuc WAKAME', randString);
        req.session.active_info = {
            token: randToken,
            email: user.email,
            passcode: randString,
        }
        req.session.failPasscode = 0;
        console.log('Ma xac thuc ' + randString);
        return res.redirect('/active?token=' + randToken);
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
    var passcode_info = req.session.active_info;
    var received_code = req.body.active_code || '';
    if (passcode_info.passcode != received_code) {
        if (req.session.failPasscode == undefined) {
            req.session.failPasscode = 1;
        } else {
            req.session.failPasscode = req.session.failPasscode + 1;
        }
        if (req.session.failPasscode >= 3) {
            var randToken = randomString.password({
                length: 100,
                string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            });
            var randString = randomString.password({
                length: 6,
                string: "0123456789"
            });
            mailer.sendMail(req.session.user_email, 'Ma xac thuc WAKAME', randString);
            req.session.active_info = {
                token: randToken,
                email: req.session.user_email,
                passcode: randString,
            }
            req.session.failPasscode = 0;
            console.log('Ma xac thuc ' + randString);
            return res.redirect('/active?token=' + randToken);
        } else {
            return res.redirect('/active?token=' + req.query.token);
        }
    } else {
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
exports.get_resetpwPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('resetpw', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
            user_email: req.user.dataValues.email
        });
    }
    else {
        return res.render('resetpw', {
            title: 'Express',
            Authenticated: xacnhan
        });
    }
}
exports.post_change_pw = function (req, res, next) {
    console.log(req.body)
    bcrypt.compare(req.body.currentpw, req.user.dataValues.password).then((result) => {
        if (result && (req.body.newpw == req.body.re_newpw)) {
            bcrypt.hash(req.body.newpw, 10, function (err, hash) {
                models.USER.update(
                    {
                        password: hash,
                    },
                    {
                        where: {
                            email: req.user.dataValues.email,
                        }
                    }
                );
                res.send('Da thay doi pass');
            })
        }
        else {
            res.send('saimatkhau');
        }

    })
}
exports.get_captcha = function (req, res, next) {
    var captcha = svgCaptcha.create();
    //console.log(captcha);
    //mailer.sendMail('tailm0796@gmail.com', 'test thử email CLB', 'không có gì đâu nha');
    console.log(uuidv4());
    return res.render('captcha', { captcha: captcha.data });
}
exports.post_captcha = async function (req, res, next) {
    console.log(req.body.title)
    await models.BLOG.create({
        uuid: uuidv4(),
        USERId: 1,
        slug: convert.stringToSlug(req.body.title),
        CATEGORYId: 1,
        description: req.body.description,
        title: req.body.title,
        content: req.body.content,
        blogimg: 'https://seido.vn/wp-content/uploads/2020/12/Colorful-Geometric-Simple-Background-Image.jpg'
    });
    res.redirect('/dangbai')
}
var convert = require('../utils/VNeseStrToSlug');
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
    await models.USER.create({ fullName: 'minh tai', actived: true, email: 'mct.minhtai@gmail.com', password: '$2a$10$VZZVEldp4B.FEFxP2uci9.3s.QiLEpC05m9aTbXa.v6tPzDlNLAmu' });
    // await models.USER.create({ fullName: 'VietAnhJav', email: 'JavIsNumberOne@gmail.com', password: 'vietanh' });
    // await models.USER.create({ fullName: 'VietAnhLoveJAV', email: 'JavIsNumber1@gmail.com', password: 'vietanh' });
    await models.TAG.create({ TEN_TAG: 'Tiếng Nhật' });
    await models.TAG.create({ TEN_TAG: 'Đời sống' });
    await models.TAG.create({ TEN_TAG: 'Tài liệu' });
    await models.TAG.create({ TEN_TAG: 'Mẹo học tập' });
    await models.TAG.create({ TEN_TAG: 'Thông báo' });
    await models.CATEGORY.create({ name: 'Luyện Nghe' });
    await models.CATEGORY.create({ name: 'Luyện Đọc' });
    await models.CATEGORY.create({ name: 'N1' });
    await models.CATEGORY.create({ name: 'N2' });
    await models.CATEGORY.create({ name: 'N3' });
    await models.CATEGORY.create({ name: 'N4' });
    await models.CATEGORY.create({ name: 'N5' });

    await models.BLOG.create({
        slug: convert.stringToSlug('VÌ SAO NÊN HỌC TIÊNG NHẬT'),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Tiếng Nhật cung cấp nhiều lợi ích trong học tập và làm việc sau này. Vậy hãy cùng điểm qua một số lợi ích của việc học tiếng Nhật nhé.',
        title: 'VÌ SAO NÊN HỌC TIÊNG NHẬT',
        content: '<p style="text-align: center;" data-mce-style="text-align: center;">Việc học một ngôn ngữ chưa bao giờ là thừa trong thời đại ngày nay khi chỉ biết mỗi tiếng Anh là chưa đủ. Trong môi trường làm việc cạnh tranh như hiện nay, việc học thêm tiếng nhật là cần thiết để tăng cơ hội việc làm, có được mức lương mong muốn. Hãy cùng wakame chỉ ra 5 lợi ích mà tiếng nhật mang lại cho người học nhé.</p><p><strong>1. Học tiếng nhật để tìm kiếm mức lương cao&nbsp;</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Với sự đầu tư ngày càng tăng từ Nhật Bản cũng như sự hợp tác&nbsp;của các doanh nghiệp Việt Nam với Nhật Bản, nhu cầu công việc cho người biết tiếng Nhật là tương đối cao. Ví dụ như ngành IT, một sinh viên mới tốt nghiệp ra trường <em>biết tiếng Nhậ</em>t cũng đã có mức lương từ 500 – 600 USD/ tháng. Trong khi đó, một nhân viên IT đã <em>thành thạo tiếng Nhật</em>, thì mức lương sẽ không bao giờ dưới 1000 USD. <br>Vì số lượng người biết tiếng Nhật là hạn chế, nên việc học tiếng Nhật sẽ giúp bạn trở nên hấp dẫn hơn trong mắt nhà tuyển dụng, dễ dàng kiếm dược mức lương tốt.</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p><br><strong>2. Học tiếng Nhật để tìm kiếm cơ hội việc làm, du học, sinh sống tại Nhật</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;"><em>&nbsp;Đầu tư cho tiếng Nhật</em> mang lại lợi thế không hề nhỏ cho tương lai.</p><p><br><img src="https://drive.google.com/uc?export=download&amp;id=1cFo_2_kYN5vYHnYVh_qOYmFmPYsJ8fDC" width="483" height="242" alt="Đầu tư cho tiếng Nhật" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1cFo_2_kYN5vYHnYVh_qOYmFmPYsJ8fDC" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Việc học tiếng Nhật giúp tăng thêm khả năng giành học bổng tại các trường đại học của Nhật Bản, mở ra cơ hội du học, trải nghiệm tuyệt vời tại xứ sở hoa anh đào.. Nếu bạn học tiếng Nhật một cách thực sự tập trung và cố gắng thì việc đạt được <em>bằng tiếng Nhật N3, N4 hay N5</em> là không khó. Có bằng cấp, giao tiếp tốt mà lại vững kinh nghiệm thì chuyện việc làm là hiển nhiên. Hơn nữa, việc giao tiếp tiếng Nhật tốt sẽ giúp bạn tự tin hoà nhập, vượt qua những trở ngại nơi đất khách quê người.&nbsp;</p><p><strong>3. Học tiếng Nhật để cải thiện trí thông minh</strong></p><p>Có thể bạn sẽ không tin, nhưng việc học một ngôn ngữ mới, mà đặc biệt là ngôn ngữ sử dụng nhiều từ tượng hình như tiếng Nhật giúp phát triển hai bán cầu não tốt hơn, nâng cao hiểu biết, tư duy ngôn ngữ. Nếu còn đang băn khoăn lựa chọn ngôn ngữ nào thì tiếng Nhật là sự lựa chọn hoàn hảo cho bạn.</p><p><strong>&nbsp;4. </strong><strong>Học tiếng Nhật để dễ dàng đàm phán kinh doanh</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Như mình đã nói từ trước, Nhật Bản đã và đang tăng cường đầu tư vào Việt Nam. Việc học tiếng Nhật tốt sẽ giúp bạn dễ dàng hơn trong việc tìm kiếm <em>cơ hội làm việc tại Nhật Bản.</em> Thay vì cần thông dịch viên, bạn có thể tự mình trò chuyện với đối tác, hiểu rõ đối tác hơn, tăng khả năng thành công trong việc đàm phán, kí kết <br>hợp đồng.</p><p><img src="https://drive.google.com/uc?export=download&amp;id=1snzaJNVe2drSjXg_LMalmXSq19lyCD6v" width="599" height="399" alt="Cơ hội làm việc tại Nhật Bản" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1snzaJNVe2drSjXg_LMalmXSq19lyCD6v" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"><br></p><p><strong>5. Học tiếng Nhật để truyền cảm hứng đối với các ngôn ngữ khác</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Trong quá trình bạn <em>cày tiếng Nhật</em> chắc chắn không thể thiếu kanji rồi. Thử nghĩ xem, nếu sau này bạn dự định học tiếng Trung, vì đã được làm quen với kha khá chữ hán nên chắc chắn con đường của bạn sẽ dễ dàng hơn nhiều. Sẽ rất là bình thường nếu một người nào đó bắt đầu học tiếng Nhật, sau đó chuyển sang học tiếng Hàn Quốc, Trung Quốc hoặc Thái Lan. Bạn có thể mở rộng sự hiểu biết của mình một cách đáng kể về ngôn ngữ và văn hóa Châu Á.</p><p style="text-align: justify;" data-mce-style="text-align: justify;"><br></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Vậy wakame đã chỉ ra giúp bạn những lợi ích sẽ có của việc học tiếng Nhật rồi đấy. Hi vọng rằng những điều trên sẽ giúp bạn lựa chọn học tiếng Nhật trong thời gian tới cũng như nắm bắt cơ hội tốt mà việc biết tiếng Nhật mang lại. Chúc bạn thành công!</p>',
        blogimg: 'https://drive.google.com/uc?export=download&id=1evwlrNyR6rCVjoHq5m2WpDi-sV4jw5m-',
        kwlist: 'biết tiếng Nhật,  thành thạo tiếng Nhật, đạt bằng tiếng Nhật N3, N4 hay N5, hợp tác với các doanh nghiệp Nhật Bản, ôn luyện tiếng Nhật '
    });
    await models.BLOG.create({
        slug: convert.stringToSlug('VĂN HOÁ DOANH NGHIỆP NHẬT BẢN'),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và coi trọng. Bởi người Nhật luôn thể hiện tốt lễ giáo, ứng xử trong giao tiếp. ',
        title: 'VĂN HOÁ DOANH NGHIỆP NHẬT BẢN',
        content: '<p style="text-align: justify;" data-mce-style="text-align: justify;">Nhiều công ty Nhật Bản hiện nay đã xây dựng được văn hóa công ty thành công và đạt hiệu quả cao. Đó cũng là yếu tố góp phần vào việc đưa các công ty Nhật trở thành một trong những công ty hàng đầu thế giới. Người Nhật hiểu rằng<em> “xây dựng văn hóa doanh nghiệp là điều cần thiết để phát triển doanh nghiệp”. </em>Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và đặt nặng. Bởi người Nhật khá coi trọng vấn đề về lễ giáo, ứng xử trong giao tiếp.</p><p><br><strong>Hãy cùng wakame điểm qua những nét độc đáo của <em>văn hoá doanh nghiệp Nhật Bản</em> nhé!</strong></p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" width="418" height="313" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>Triết lý “Khách hàng là thượng đế”</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Đây là triết lý kinh doanh rất thường thấy ở các doanh nghiệp Nhật Bản. Triết lý này phủ rộng ở rất nhiều lĩnh vực từ du lịch, nhà hàng khách sạn, … cho tới các ngành cơ khí. Nếu bạn đã từng trải nghiệm dịch vụ của hãng máy bay ANA, bạn sẽ thấy sự chỉnh chu và chuyên nghiệp của họ là rất đáng nể. Các sản phẩm khác xuất xứ từ đất nước mặt trời mọc như Toyota, Yamaha, …luôn có độ bền và sự ổn định đáng tin cậy. Sở dĩ như vậy bởi người Nhật luôn đề cao sự phát triển, vị thế và hình ảnh của doanh nghiệp trong xã hội. <em>Làm việc với người Nhật</em> bạn sẽ hỏi hỏi nhiều điều thú vị từ triết lý chăm sóc khách hàng của họ.</p><p><strong>&nbsp;</strong></p><p><strong>Nghệ thuật đối nhân xử thế </strong></p><p>Người Nhật rất coi trọng lễ nghĩa. Điều đó được thể hiện ngay cả trong ngôn ngữ và dĩ nhiên trong doanh nghiệp Nhật Bản lại càng phải chuẩn mực hơn. Trong quan hệ, người Nhật Bản chấp nhận người khác có thể mắc sai lầm, nhưng luôn cho đối tác hiểu rằng điều đó không được phép lặp lại và tinh thần sửa chữa luôn thể hiện ở kết quả cuối cùng. Người Nhật luôn làm việc với một tinh thần trách nhiệm cao nhất.</p><p><br>Ngoài ra, bạn luôn có quyền đóng góp ý kiến của mình bất kể chức vụ cao thấp. Văn hoá doanh nghiệp Nhật Bản đều coi con người là tài nguyên quí giá nhất, nguồn động lực quan trọng nhất làm nên giá trị gia tăng và phát triển bền vững của doanh nghiệp. <em>Giá trị văn hoá doanh nghiệp Nhật Bản</em> được thể hiện ở việc tôn trọng sáng kiến của mọi người, tạo động lực để suy nghĩ cải tiến công việc của mình và của người khác. Điều này sẽ đẩy mạnh hiệu suất chung của tất cả mọi người.</p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>&nbsp;</strong></p><p><strong>Đúng giờ</strong></p><p>Bạn nào đã quen với “giờ cao su” chắc sẽ cảm thấy hơi trật nhịp khi mới bước chân vào doanh nghiệp Nhật Bản nhỉ. Trong môi trường làm việc của hầu hết các doanh nghiệp Nhật, vấn đề về việc&nbsp;<a href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/" data-mce-href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/">sắp xếp quỹ thời gian</a><strong>,</strong>&nbsp;hoàn thành công việc&nbsp;luôn là một trong những vấn đề được coi trọng nhất. Việc đúng giờ cũng được coi là một nét văn hóa của người Nhật.</p><p><strong>&nbsp;</strong></p><p><strong>Xây dựng các mối quan hệ</strong></p><p>Người Nhật thể hiện sự phân cấp rõ ràng trong các mối quan hệ doanh nghiệp và đề cao tính tôn ti trật tự. Các mối quan hệ giữa sếp và nhân viên, cấp trên và cấp dưới hay giữa các đồng nghiệp với nhau đều rất được xem trọng ở các công ty Nhật. Việc xây dựng những mắt xích quan hệ một cách chân thành không chỉ khiến cho đội nhóm làm việc vững mạnh hơn mà còn là tiền đề cho sự phát triển niềm tin tuyệt đối giữa mọi người trong công ty.</p><p>Ngoài việc xây dựng&nbsp;<strong>hình ảnh và phong thái Nhật Bản chuyên nghiệp</strong>&nbsp;khi làm việc, người Nhật cũng biết cân bằng công việc với giải trí, đi chơi cùng đồng nghiệp như cùng nhau đến quầy bar, karaoke, … sau một ngày công sở. Điều này sẽ tăng thêm sự chia sẻ lẫn nhau, thắt chặt tình bạn hay củng cố tập thể. &nbsp;</p><p><br></p><p>Như vậy, <em>văn hóa doanh nghiệp Nhật Bản</em> không phải chỉ là những chuẩn mực nguyên tắc hà khắc và cũng không phải là sự thoải mái không giới hạn mà chính là sự dung hòa giữa công việc và tinh thần, là sự phù hợp giữa cá nhân và tổ chức, giữa các cá nhân, tập thể với nhau.&nbsp;Bạn sẽ luôn có cơ hội thể hiện và phát triển bản thân bất cứ lúc nào khi là một phần trong một môi trường tổ chức chuyên nghiệp, tràn đầy những bản sắc riêng như doanh nghiệp Nhật Bản.</p>',
        blogimg: 'https://drive.google.com/uc?export=download&id=1evwlrNyR6rCVjoHq5m2WpDi-sV4jw5m-',
        kwlist: 'biết tiếng Nhật,  thành thạo tiếng Nhật, đạt bằng tiếng Nhật N3, N4 hay N5, hợp tác với các doanh nghiệp Nhật Bản, ôn luyện tiếng Nhật '
    });
    await models.BLOG.create({
        slug: convert.stringToSlug('NĂM TUYỆT CHIÊU HỌC TIẾNG NHẬT TRỰC TUYẾN HIỆU QUẢ'),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và coi trọng. Bởi người Nhật luôn thể hiện tốt lễ giáo, ứng xử trong giao tiếp. ',
        title: 'VĂN HOÁ DOANH NGHIỆP NHẬT BẢN',
        content: '<p style="text-align: justify;" data-mce-style="text-align: justify;">Nhiều công ty Nhật Bản hiện nay đã xây dựng được văn hóa công ty thành công và đạt hiệu quả cao. Đó cũng là yếu tố góp phần vào việc đưa các công ty Nhật trở thành một trong những công ty hàng đầu thế giới. Người Nhật hiểu rằng<em> “xây dựng văn hóa doanh nghiệp là điều cần thiết để phát triển doanh nghiệp”. </em>Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và đặt nặng. Bởi người Nhật khá coi trọng vấn đề về lễ giáo, ứng xử trong giao tiếp.</p><p><br><strong>Hãy cùng wakame điểm qua những nét độc đáo của <em>văn hoá doanh nghiệp Nhật Bản</em> nhé!</strong></p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" width="418" height="313" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>Triết lý “Khách hàng là thượng đế”</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Đây là triết lý kinh doanh rất thường thấy ở các doanh nghiệp Nhật Bản. Triết lý này phủ rộng ở rất nhiều lĩnh vực từ du lịch, nhà hàng khách sạn, … cho tới các ngành cơ khí. Nếu bạn đã từng trải nghiệm dịch vụ của hãng máy bay ANA, bạn sẽ thấy sự chỉnh chu và chuyên nghiệp của họ là rất đáng nể. Các sản phẩm khác xuất xứ từ đất nước mặt trời mọc như Toyota, Yamaha, …luôn có độ bền và sự ổn định đáng tin cậy. Sở dĩ như vậy bởi người Nhật luôn đề cao sự phát triển, vị thế và hình ảnh của doanh nghiệp trong xã hội. <em>Làm việc với người Nhật</em> bạn sẽ hỏi hỏi nhiều điều thú vị từ triết lý chăm sóc khách hàng của họ.</p><p><strong>&nbsp;</strong></p><p><strong>Nghệ thuật đối nhân xử thế </strong></p><p>Người Nhật rất coi trọng lễ nghĩa. Điều đó được thể hiện ngay cả trong ngôn ngữ và dĩ nhiên trong doanh nghiệp Nhật Bản lại càng phải chuẩn mực hơn. Trong quan hệ, người Nhật Bản chấp nhận người khác có thể mắc sai lầm, nhưng luôn cho đối tác hiểu rằng điều đó không được phép lặp lại và tinh thần sửa chữa luôn thể hiện ở kết quả cuối cùng. Người Nhật luôn làm việc với một tinh thần trách nhiệm cao nhất.</p><p><br>Ngoài ra, bạn luôn có quyền đóng góp ý kiến của mình bất kể chức vụ cao thấp. Văn hoá doanh nghiệp Nhật Bản đều coi con người là tài nguyên quí giá nhất, nguồn động lực quan trọng nhất làm nên giá trị gia tăng và phát triển bền vững của doanh nghiệp. <em>Giá trị văn hoá doanh nghiệp Nhật Bản</em> được thể hiện ở việc tôn trọng sáng kiến của mọi người, tạo động lực để suy nghĩ cải tiến công việc của mình và của người khác. Điều này sẽ đẩy mạnh hiệu suất chung của tất cả mọi người.</p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>&nbsp;</strong></p><p><strong>Đúng giờ</strong></p><p>Bạn nào đã quen với “giờ cao su” chắc sẽ cảm thấy hơi trật nhịp khi mới bước chân vào doanh nghiệp Nhật Bản nhỉ. Trong môi trường làm việc của hầu hết các doanh nghiệp Nhật, vấn đề về việc&nbsp;<a href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/" data-mce-href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/">sắp xếp quỹ thời gian</a><strong>,</strong>&nbsp;hoàn thành công việc&nbsp;luôn là một trong những vấn đề được coi trọng nhất. Việc đúng giờ cũng được coi là một nét văn hóa của người Nhật.</p><p><strong>&nbsp;</strong></p><p><strong>Xây dựng các mối quan hệ</strong></p><p>Người Nhật thể hiện sự phân cấp rõ ràng trong các mối quan hệ doanh nghiệp và đề cao tính tôn ti trật tự. Các mối quan hệ giữa sếp và nhân viên, cấp trên và cấp dưới hay giữa các đồng nghiệp với nhau đều rất được xem trọng ở các công ty Nhật. Việc xây dựng những mắt xích quan hệ một cách chân thành không chỉ khiến cho đội nhóm làm việc vững mạnh hơn mà còn là tiền đề cho sự phát triển niềm tin tuyệt đối giữa mọi người trong công ty.</p><p>Ngoài việc xây dựng&nbsp;<strong>hình ảnh và phong thái Nhật Bản chuyên nghiệp</strong>&nbsp;khi làm việc, người Nhật cũng biết cân bằng công việc với giải trí, đi chơi cùng đồng nghiệp như cùng nhau đến quầy bar, karaoke, … sau một ngày công sở. Điều này sẽ tăng thêm sự chia sẻ lẫn nhau, thắt chặt tình bạn hay củng cố tập thể. &nbsp;</p><p><br></p><p>Như vậy, <em>văn hóa doanh nghiệp Nhật Bản</em> không phải chỉ là những chuẩn mực nguyên tắc hà khắc và cũng không phải là sự thoải mái không giới hạn mà chính là sự dung hòa giữa công việc và tinh thần, là sự phù hợp giữa cá nhân và tổ chức, giữa các cá nhân, tập thể với nhau.&nbsp;Bạn sẽ luôn có cơ hội thể hiện và phát triển bản thân bất cứ lúc nào khi là một phần trong một môi trường tổ chức chuyên nghiệp, tràn đầy những bản sắc riêng như doanh nghiệp Nhật Bản.</p>',
        blogimg: 'https://drive.google.com/uc?export=download&id=1evwlrNyR6rCVjoHq5m2WpDi-sV4jw5m-',
        kwlist: 'biết tiếng Nhật,  thành thạo tiếng Nhật, đạt bằng tiếng Nhật N3, N4 hay N5, hợp tác với các doanh nghiệp Nhật Bản, ôn luyện tiếng Nhật '
    });
    await models.BLOG.create({
        slug: convert.stringToSlug('BÍ KÍP LUYỆN THI JLPT HIỆU QUẢ'),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và coi trọng. Bởi người Nhật luôn thể hiện tốt lễ giáo, ứng xử trong giao tiếp. ',
        title: 'VĂN HOÁ DOANH NGHIỆP NHẬT BẢN',
        content: '<p style="text-align: justify;" data-mce-style="text-align: justify;">Nhiều công ty Nhật Bản hiện nay đã xây dựng được văn hóa công ty thành công và đạt hiệu quả cao. Đó cũng là yếu tố góp phần vào việc đưa các công ty Nhật trở thành một trong những công ty hàng đầu thế giới. Người Nhật hiểu rằng<em> “xây dựng văn hóa doanh nghiệp là điều cần thiết để phát triển doanh nghiệp”. </em>Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và đặt nặng. Bởi người Nhật khá coi trọng vấn đề về lễ giáo, ứng xử trong giao tiếp.</p><p><br><strong>Hãy cùng wakame điểm qua những nét độc đáo của <em>văn hoá doanh nghiệp Nhật Bản</em> nhé!</strong></p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" width="418" height="313" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>Triết lý “Khách hàng là thượng đế”</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Đây là triết lý kinh doanh rất thường thấy ở các doanh nghiệp Nhật Bản. Triết lý này phủ rộng ở rất nhiều lĩnh vực từ du lịch, nhà hàng khách sạn, … cho tới các ngành cơ khí. Nếu bạn đã từng trải nghiệm dịch vụ của hãng máy bay ANA, bạn sẽ thấy sự chỉnh chu và chuyên nghiệp của họ là rất đáng nể. Các sản phẩm khác xuất xứ từ đất nước mặt trời mọc như Toyota, Yamaha, …luôn có độ bền và sự ổn định đáng tin cậy. Sở dĩ như vậy bởi người Nhật luôn đề cao sự phát triển, vị thế và hình ảnh của doanh nghiệp trong xã hội. <em>Làm việc với người Nhật</em> bạn sẽ hỏi hỏi nhiều điều thú vị từ triết lý chăm sóc khách hàng của họ.</p><p><strong>&nbsp;</strong></p><p><strong>Nghệ thuật đối nhân xử thế </strong></p><p>Người Nhật rất coi trọng lễ nghĩa. Điều đó được thể hiện ngay cả trong ngôn ngữ và dĩ nhiên trong doanh nghiệp Nhật Bản lại càng phải chuẩn mực hơn. Trong quan hệ, người Nhật Bản chấp nhận người khác có thể mắc sai lầm, nhưng luôn cho đối tác hiểu rằng điều đó không được phép lặp lại và tinh thần sửa chữa luôn thể hiện ở kết quả cuối cùng. Người Nhật luôn làm việc với một tinh thần trách nhiệm cao nhất.</p><p><br>Ngoài ra, bạn luôn có quyền đóng góp ý kiến của mình bất kể chức vụ cao thấp. Văn hoá doanh nghiệp Nhật Bản đều coi con người là tài nguyên quí giá nhất, nguồn động lực quan trọng nhất làm nên giá trị gia tăng và phát triển bền vững của doanh nghiệp. <em>Giá trị văn hoá doanh nghiệp Nhật Bản</em> được thể hiện ở việc tôn trọng sáng kiến của mọi người, tạo động lực để suy nghĩ cải tiến công việc của mình và của người khác. Điều này sẽ đẩy mạnh hiệu suất chung của tất cả mọi người.</p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>&nbsp;</strong></p><p><strong>Đúng giờ</strong></p><p>Bạn nào đã quen với “giờ cao su” chắc sẽ cảm thấy hơi trật nhịp khi mới bước chân vào doanh nghiệp Nhật Bản nhỉ. Trong môi trường làm việc của hầu hết các doanh nghiệp Nhật, vấn đề về việc&nbsp;<a href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/" data-mce-href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/">sắp xếp quỹ thời gian</a><strong>,</strong>&nbsp;hoàn thành công việc&nbsp;luôn là một trong những vấn đề được coi trọng nhất. Việc đúng giờ cũng được coi là một nét văn hóa của người Nhật.</p><p><strong>&nbsp;</strong></p><p><strong>Xây dựng các mối quan hệ</strong></p><p>Người Nhật thể hiện sự phân cấp rõ ràng trong các mối quan hệ doanh nghiệp và đề cao tính tôn ti trật tự. Các mối quan hệ giữa sếp và nhân viên, cấp trên và cấp dưới hay giữa các đồng nghiệp với nhau đều rất được xem trọng ở các công ty Nhật. Việc xây dựng những mắt xích quan hệ một cách chân thành không chỉ khiến cho đội nhóm làm việc vững mạnh hơn mà còn là tiền đề cho sự phát triển niềm tin tuyệt đối giữa mọi người trong công ty.</p><p>Ngoài việc xây dựng&nbsp;<strong>hình ảnh và phong thái Nhật Bản chuyên nghiệp</strong>&nbsp;khi làm việc, người Nhật cũng biết cân bằng công việc với giải trí, đi chơi cùng đồng nghiệp như cùng nhau đến quầy bar, karaoke, … sau một ngày công sở. Điều này sẽ tăng thêm sự chia sẻ lẫn nhau, thắt chặt tình bạn hay củng cố tập thể. &nbsp;</p><p><br></p><p>Như vậy, <em>văn hóa doanh nghiệp Nhật Bản</em> không phải chỉ là những chuẩn mực nguyên tắc hà khắc và cũng không phải là sự thoải mái không giới hạn mà chính là sự dung hòa giữa công việc và tinh thần, là sự phù hợp giữa cá nhân và tổ chức, giữa các cá nhân, tập thể với nhau.&nbsp;Bạn sẽ luôn có cơ hội thể hiện và phát triển bản thân bất cứ lúc nào khi là một phần trong một môi trường tổ chức chuyên nghiệp, tràn đầy những bản sắc riêng như doanh nghiệp Nhật Bản.</p>',
        blogimg: 'https://drive.google.com/uc?export=download&id=1evwlrNyR6rCVjoHq5m2WpDi-sV4jw5m-',
        kwlist: 'biết tiếng Nhật,  thành thạo tiếng Nhật, đạt bằng tiếng Nhật N3, N4 hay N5, hợp tác với các doanh nghiệp Nhật Bản, ôn luyện tiếng Nhật '
    });
    await models.BLOG.create({
        slug: convert.stringToSlug('CƠ HỘI VIỆC LÀM TIẾNG NHẬT'),
        USERId: 1,
        CATEGORYId: 1,
        description: 'Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và coi trọng. Bởi người Nhật luôn thể hiện tốt lễ giáo, ứng xử trong giao tiếp. ',
        title: 'VĂN HOÁ DOANH NGHIỆP NHẬT BẢN',
        content: '<p style="text-align: justify;" data-mce-style="text-align: justify;">Nhiều công ty Nhật Bản hiện nay đã xây dựng được văn hóa công ty thành công và đạt hiệu quả cao. Đó cũng là yếu tố góp phần vào việc đưa các công ty Nhật trở thành một trong những công ty hàng đầu thế giới. Người Nhật hiểu rằng<em> “xây dựng văn hóa doanh nghiệp là điều cần thiết để phát triển doanh nghiệp”. </em>Với các doanh nghiệp Nhật Bản, yếu tố văn hóa rất được quan tâm và đặt nặng. Bởi người Nhật khá coi trọng vấn đề về lễ giáo, ứng xử trong giao tiếp.</p><p><br><strong>Hãy cùng wakame điểm qua những nét độc đáo của <em>văn hoá doanh nghiệp Nhật Bản</em> nhé!</strong></p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" width="418" height="313" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1PnTCRlAuMGYb5nzUp_WNUZXYVjonofmH" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>Triết lý “Khách hàng là thượng đế”</strong></p><p style="text-align: justify;" data-mce-style="text-align: justify;">Đây là triết lý kinh doanh rất thường thấy ở các doanh nghiệp Nhật Bản. Triết lý này phủ rộng ở rất nhiều lĩnh vực từ du lịch, nhà hàng khách sạn, … cho tới các ngành cơ khí. Nếu bạn đã từng trải nghiệm dịch vụ của hãng máy bay ANA, bạn sẽ thấy sự chỉnh chu và chuyên nghiệp của họ là rất đáng nể. Các sản phẩm khác xuất xứ từ đất nước mặt trời mọc như Toyota, Yamaha, …luôn có độ bền và sự ổn định đáng tin cậy. Sở dĩ như vậy bởi người Nhật luôn đề cao sự phát triển, vị thế và hình ảnh của doanh nghiệp trong xã hội. <em>Làm việc với người Nhật</em> bạn sẽ hỏi hỏi nhiều điều thú vị từ triết lý chăm sóc khách hàng của họ.</p><p><strong>&nbsp;</strong></p><p><strong>Nghệ thuật đối nhân xử thế </strong></p><p>Người Nhật rất coi trọng lễ nghĩa. Điều đó được thể hiện ngay cả trong ngôn ngữ và dĩ nhiên trong doanh nghiệp Nhật Bản lại càng phải chuẩn mực hơn. Trong quan hệ, người Nhật Bản chấp nhận người khác có thể mắc sai lầm, nhưng luôn cho đối tác hiểu rằng điều đó không được phép lặp lại và tinh thần sửa chữa luôn thể hiện ở kết quả cuối cùng. Người Nhật luôn làm việc với một tinh thần trách nhiệm cao nhất.</p><p><br>Ngoài ra, bạn luôn có quyền đóng góp ý kiến của mình bất kể chức vụ cao thấp. Văn hoá doanh nghiệp Nhật Bản đều coi con người là tài nguyên quí giá nhất, nguồn động lực quan trọng nhất làm nên giá trị gia tăng và phát triển bền vững của doanh nghiệp. <em>Giá trị văn hoá doanh nghiệp Nhật Bản</em> được thể hiện ở việc tôn trọng sáng kiến của mọi người, tạo động lực để suy nghĩ cải tiến công việc của mình và của người khác. Điều này sẽ đẩy mạnh hiệu suất chung của tất cả mọi người.</p><p><strong>&nbsp;<img src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" alt="" data-mce-src="https://drive.google.com/uc?export=download&amp;id=1znfzv7Y-2WSc-WixL3KA37FrWqt17h53" style="display: block; margin-left: auto; margin-right: auto;" data-mce-style="display: block; margin-left: auto; margin-right: auto;"></strong></p><p><strong>&nbsp;</strong></p><p><strong>Đúng giờ</strong></p><p>Bạn nào đã quen với “giờ cao su” chắc sẽ cảm thấy hơi trật nhịp khi mới bước chân vào doanh nghiệp Nhật Bản nhỉ. Trong môi trường làm việc của hầu hết các doanh nghiệp Nhật, vấn đề về việc&nbsp;<a href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/" data-mce-href="https://1office.vn/cam-nang-su-dung-thoi-gian-hieu-qua-cho-nha-quan-ly-phan-1/">sắp xếp quỹ thời gian</a><strong>,</strong>&nbsp;hoàn thành công việc&nbsp;luôn là một trong những vấn đề được coi trọng nhất. Việc đúng giờ cũng được coi là một nét văn hóa của người Nhật.</p><p><strong>&nbsp;</strong></p><p><strong>Xây dựng các mối quan hệ</strong></p><p>Người Nhật thể hiện sự phân cấp rõ ràng trong các mối quan hệ doanh nghiệp và đề cao tính tôn ti trật tự. Các mối quan hệ giữa sếp và nhân viên, cấp trên và cấp dưới hay giữa các đồng nghiệp với nhau đều rất được xem trọng ở các công ty Nhật. Việc xây dựng những mắt xích quan hệ một cách chân thành không chỉ khiến cho đội nhóm làm việc vững mạnh hơn mà còn là tiền đề cho sự phát triển niềm tin tuyệt đối giữa mọi người trong công ty.</p><p>Ngoài việc xây dựng&nbsp;<strong>hình ảnh và phong thái Nhật Bản chuyên nghiệp</strong>&nbsp;khi làm việc, người Nhật cũng biết cân bằng công việc với giải trí, đi chơi cùng đồng nghiệp như cùng nhau đến quầy bar, karaoke, … sau một ngày công sở. Điều này sẽ tăng thêm sự chia sẻ lẫn nhau, thắt chặt tình bạn hay củng cố tập thể. &nbsp;</p><p><br></p><p>Như vậy, <em>văn hóa doanh nghiệp Nhật Bản</em> không phải chỉ là những chuẩn mực nguyên tắc hà khắc và cũng không phải là sự thoải mái không giới hạn mà chính là sự dung hòa giữa công việc và tinh thần, là sự phù hợp giữa cá nhân và tổ chức, giữa các cá nhân, tập thể với nhau.&nbsp;Bạn sẽ luôn có cơ hội thể hiện và phát triển bản thân bất cứ lúc nào khi là một phần trong một môi trường tổ chức chuyên nghiệp, tràn đầy những bản sắc riêng như doanh nghiệp Nhật Bản.</p>',
        blogimg: 'https://drive.google.com/uc?export=download&id=1evwlrNyR6rCVjoHq5m2WpDi-sV4jw5m-',
        kwlist: 'biết tiếng Nhật,  thành thạo tiếng Nhật, đạt bằng tiếng Nhật N3, N4 hay N5, hợp tác với các doanh nghiệp Nhật Bản, ôn luyện tiếng Nhật '
    });



    await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 1 });
    await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 2 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 2 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 2 });
    await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 3 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 3 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 3 });
    await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 4 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 4 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 4 });
    await models.TAG_BLOG.create({ TAGId: 1, BLOGId: 5 });
    await models.TAG_BLOG.create({ TAGId: 2, BLOGId: 5 });
    await models.TAG_BLOG.create({ TAGId: 3, BLOGId: 5 });
    // await models.COMMENT.create({
    //     USERId: 1,
    //     BLOGId: 1,
    //     cmcontent: 'bai viet qua hay',
    // })
    // await models.COMMENT.create({
    //     USERId: 1,
    //     BLOGId: 1,
    //     cmcontent: 'met qua luon',
    // });

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
    // await models.USER_UPGRADE_BLOG.create({ USERId: 1, BLOGId: 1 });
    // await models.TAGKH.create({ TEN_TAG_KH: 'Abyss' });
    // await models.KHOAHOC.create({ TENKH: 'No God Please', KH_IMG: 'Care', DESCRIPTION: 'No God Please,NOOO', SO_BAI_HOC: 15, THONG_TIN_KH: 'ABC', GIANGVIENId: '1' })
    // await models.TAGKH_KHOAHOC.create({ KHOAHOCId: 1, TAGKHId: 1 });
    // await models.CHUDEKH.create({ TEN_CHU_DE: 'Hello...' });
    // await models.CHUDE_KHOAHOC.create({ KHOAHOCId: '1', CHUDEKHId: '1' });
    // await models.BAIHOC.create({ KHOAHOCId: 1, TEN_BAI_HOC: 'Ranh Roi Sinh Nong Noi', LINK: 'xxx' })
    // await models.GOP_Y.create({ NAME: 'God', EMAIL: 'GodIsTheBest@gmail.com', SUBJECT: '1 2 3 5', MESSENGER: 'Rơi số 4 rồi' });
    users = []
    await models.USER.findAll({ attributes: ['fullName', 'email', 'password'] }).then((all) => {
        all.forEach((item, index) => {
            users.push(item.dataValues);
        })
        res.render('test', { users: users });
    });


}