const { validationResult } = require('express-validator');
var svgCaptcha = require('svg-captcha');
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

