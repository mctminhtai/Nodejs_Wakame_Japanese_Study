exports.get_newsPage = function (req, res, next) {
    res.render('newsPage', { title: 'Express' });
}
exports.get_newsWorld = function (req, res, next) {
    res.render('newsWorld', { title: 'Express' });
}