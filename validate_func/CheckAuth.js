var models = require('../models');
exports.checkNotAuthenticated = function (req, res, next) {
    //console.log(req.isAuthenticated());
    // if (req.sessionID) {
    //     return res.redirect('/')
    // }
    // console.log(req);
    if (req.isAuthenticated()) {
        var redirectTo = req.session.redirectTo || '/';
        //console.log('kiem tra loi session cua minh tai', req);
        return res.redirect(redirectTo);
    }
    return next()
}
exports.checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    var redirectTo = req.session.redirectTo || '/';
    return res.redirect(redirectTo);
}
exports.isEditor = async function (req, res, next) {
    var redirectTo = req.session.redirectTo || '/';
    var reqUser = await models.USER.findOne({
        where: {
            id: req.user.id,
        }
    });
    if (reqUser.role != 'editor') {
        res.redirect(redirectTo);
    }
    return next();
}