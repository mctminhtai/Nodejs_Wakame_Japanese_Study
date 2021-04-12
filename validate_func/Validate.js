const { validationResult } = require('express-validator');
var svgCaptcha = require('svg-captcha');
exports.checkErr = function (req, res, next) {
    console.log(req.route.path);
    // const arrerrors = validationResult(req);
    // var errors = {}
    // console.log(req.body);
    // if (req.body.captcha != req.session.captcha) {
    //     errors['captcha'] = 'Mã xác nhận không đúng';
    // }
    // if (req.body.captcha == '') {
    //     errors['captcha'] = 'Chưa nhập mã xác nhận';
    // }
    // arrerrors.errors.forEach((error) => {
    //     errors[error.param] = error.msg;
    // });
    // //console.log(errors);
    // if (req.route.path == '/register') {
    //     if (Object.keys(errors).length != 0) {
    //         var captcha = svgCaptcha.create();
    //         req.session.captcha = captcha.text;
    //         return res.render('register', { errors: errors, captcha: captcha.data });
    //     }
    // }
    // if (req.route.path == '/login') {
    //     if (Object.keys(arrerrors.errors).length != 0) {
    //         return res.render('register', { errors: errors });
    //     }
    // }
    next();
}

