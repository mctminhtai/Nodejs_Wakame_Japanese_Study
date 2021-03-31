exports.get_newsPage = function (req, res, next) {
    res.render('news', { title: 'Express' });
}