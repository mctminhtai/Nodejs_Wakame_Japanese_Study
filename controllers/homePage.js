exports.get_homePage = function (req, res, next) {
    res.render('index', { title: 'Express' });
}
exports.get_aboutPage = function (req, res, next) {
    res.render('about', { title: 'Express' });
}
exports.get_blogPage = function (req, res, next) {
    res.render('blog', { title: 'Express' });
}
exports.get_blogDetailPage = function (req, res, next) {
    res.render('blog_details', { title: 'Express' });
}
exports.get_contactPage = function (req, res, next) {
    res.render('contact', { title: 'Express' });
}
exports.get_coursesPage = function (req, res, next) {
    res.render('courses', { title: 'Express' });
}
