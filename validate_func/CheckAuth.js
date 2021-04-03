exports.checkNotAuthenticated = function (req, res, next) {
    //console.log(req.isAuthenticated());
    // if (req.sessionID) {
    //     return res.redirect('/')
    // }
    // console.log(req);
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next()
}