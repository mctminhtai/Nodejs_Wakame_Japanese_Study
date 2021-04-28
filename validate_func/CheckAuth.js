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