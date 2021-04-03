exports.get_homePage = function (req, res, next) {
    return res.render('index', { title: 'Express' });
}
exports.get_aboutPage = function (req, res, next) {
    return res.render('about', { title: 'Express' });
}
exports.get_blogPage = function (req, res, next) {
    return res.render('blog', { title: 'Express' });
}
exports.get_blogDetailPage = function (req, res, next) {
    return res.render('blog_details', { title: 'Express' });
}
exports.get_contactPage = function (req, res, next) {
    return res.render('contact', { title: 'Express' });
}
exports.get_coursesPage = function (req, res, next) {
    return res.render('courses', { title: 'Express' });
}
