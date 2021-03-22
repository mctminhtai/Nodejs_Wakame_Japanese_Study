const models = require('../models');
const regValidate = require('../validate_func/registerValidate');
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
    res.render('registerPage', { error: '' });
}
exports.post_registerPage = function (req, res, next) {
    data = req.body;
    error = regValidate.valiReg(data);
    if (error) {
        res.render('registerPage', { error: error });
    } else {
        return models.User.create({
            fullName: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then(lead => {
            res.redirect('/');
        }).catch(error => {
            console.log(error);
        })
    }
}
exports.get_test = function (req, res, next) {
    users = []
    models.User.findAll({ attributes: ['fullName', 'email'] }).then((all) => {
        all.forEach((item, index) => {
            users.push(item.dataValues);
        })
        res.render('test', { users: users });
    });

}