const models = require('../models');
var convert = require('../utils/VNeseStrToSlug');
exports.getAdminPage = function (req, res, next) {
    res.render('admin/layout_admin');
}
exports.getAdminManageBlog = function (req, res, next) {
    res.render('admin/manage_blog');
}
exports.getAdminEditBlog = function (req, res, next) {
    res.render('admin/edit_blog');
}
exports.getAdminAddBlog = async function (req, res, next) {
    categories = await models.CATEGORY.findAll();
    tags = await models.TAG.findAll();
    res.render('admin/add_blog', {
        categories: categories,
        tags: tags,
    });
}
exports.postAdminAddBlog = async function (req, res, next) {
    var blog = await models.BLOG.create({
        slug: convert.stringToSlug(req.body.content.title),
        USERId: req.user.id,
        CATEGORYId: Number(req.body.content.category),
        description: req.body.content.description,
        title: req.body.content.title,
        content: req.body.content.content,
        blogimg: req.body.content.blogImg,
        kwlist: req.body.content.kwlist
    });
    tags = await models.TAG.findAll();
    tagsArr = req.body.content.tags.split('#').filter((val, index) => {
        return val != ''
    }).map((val, index) => {
        return val.trim()
    });
    tags = tags.filter((valraw, index) => {
        vt = tagsArr.findIndex((val, index) => {
            return val == valraw.TEN_TAG
        });
        return vt > -1
    }).forEach((tag, index) => {
        models.TAG_BLOG.create({
            TAGId: tag.id,
            BLOGId: blog.id,
        })
    });
    // return res.redirect('blog/' + blog.slug);
    return res.status(200);
}
