exports.get_loginPage = function (req, res, next) {
    res.render('loginPage', { title: 'Express' });
}
exports.get_registerPage = function (req, res, next) {
    res.render('registerPage', { title: 'Express' });
}