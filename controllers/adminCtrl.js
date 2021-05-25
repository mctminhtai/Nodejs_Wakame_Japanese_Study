const models = require('../models');
exports.getAdminPage = function (req, res, next) {
    res.render('admin/layout_admin');
}
exports.getAdminManagBlog = function (req, res, next) {
    res.render('admin/manage_blog');
}
exports.getAdminAddBlog = async function (req, res, next) {
    categories = await models.CATEGORY.findAll();
    results = await Promise.all([
        models.CATEGORY.findAll(),
        models.TAG.findAll()
    ]);
    console.log(results[0][0].constructor.name);
    res.render('admin/add_blog', { categories: categories });
}