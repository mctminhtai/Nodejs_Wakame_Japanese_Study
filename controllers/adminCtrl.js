const models = require('../models');
exports.getAdminPage = function (req, res, next) {
    res.render('admin/layout_admin');
}
exports.getAdminManagBlog = function (req, res, next) {
    res.render('admin/manage_blog');
}
exports.getAdminAddBlog = function (req, res, next) {
    res.render('admin/add_blog');
}