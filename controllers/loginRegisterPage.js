const models = require('../models');
exports.get_loginPage = function (req, res, next) {
    res.render('loginPage', { title: 'Express' });
}
exports.post_loginPage = function (req, res, next) {
    return models.User.create({
        email: req.body.login_email,
        password: req.body.login_password
    }).then(lead => {
        res.redirect('/');
    }).catch(error => {
        console.log(error);
    })
}
exports.get_registerPage = function (req, res, next) {
    res.render('registerPage', { title: 'Express' });
}