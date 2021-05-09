const { validationResult } = require('express-validator');
var svgCaptcha = require('svg-captcha');
const models = require('../models');
exports.checkErr = function (req, res, next) {
    const arrerrors = validationResult(req);
    var errors = {}
    arrerrors.errors.forEach((error) => {
        errors[error.param] = error.msg;
    });
    res.locals.errors = errors;
    if (req.route.path == '/register') {
        if (Object.keys(errors).length != 0) {
            console.log(errors);
            return res.render('login_register', { type: "register", errors: errors });
        }
    }
    if (req.route.path == '/login') {
        if (Object.keys(errors).length != 0) {
            return res.render('login_register', { errors: errors });
        }
    }
    next();
}
exports.ResetPwd_checkErr = async function (req, res, next) {
    var received_token = req.param('token');
    // savedToken = await models.RESETTOKEN.findOne({
    //     where: { token: received_token }
    // });
    var savedToken = req.session.rsPwdToken;
    if (savedToken.token == received_token) {
        const arrerrors = validationResult(req);
        var errors = {}
        console.log(arrerrors);
        arrerrors.errors.forEach((error) => {
            errors[error.param] = error.msg;
        });
        if (Object.keys(errors).length != 0) {
            return res.render('resetPwd_login', {
                errors: errors,
                token: received_token,
            })
        } else {
            return next();
        }
    } else {
        return res.render('resetPwd_login', {
            errors: { noti: 'Sai token rồi, hack à?' }
        })
    }
}
