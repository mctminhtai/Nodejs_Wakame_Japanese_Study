exports.checkNotAuthenticated = function (req, res, next) {
    //console.log(req.isAuthenticated());
    // if (req.sessionID) {
    //     return res.redirect('/')
    // }
    // console.log(req);
    if (req.isAuthenticated()) {
        console.log('kiem tra loi session cua minh tai', req);
        return res.redirect('/')
    }
    return next()
}