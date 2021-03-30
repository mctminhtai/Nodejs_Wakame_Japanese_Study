exports.checkNotAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}