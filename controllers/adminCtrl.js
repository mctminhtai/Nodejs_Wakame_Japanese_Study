const models = require('../models');
var convert = require('../utils/VNeseStrToSlug');
exports.getAdminPage = function (req, res, next) {
    res.render('admin/layout_admin');
}
exports.getAdminManageBlog = async function (req, res, next) {
    var blogs = await models.BLOG.findAll();
    res.render('admin/manage_blog', {
        blogs: blogs,
    });
}
exports.getAdminEditBlog = async function (req, res, next) {
    var categories = await models.CATEGORY.findAll();
    var tags = await models.TAG.findAll();
    var blog = await models.BLOG.findOne({
        where: { slug: req.param('blogslug') },
        include: ['blog_category', 'blog_tag'],
    });
    res.render('admin/edit_blog', {
        categories: categories,
        tags: tags,
        blog: blog,
    });
}
exports.postAdminEditBlog = async function (req, res, next) {
    var saveObj = {
        slug: convert.stringToSlug(req.body.content.title),
        USERId: req.user.id,
        CATEGORYId: Number(req.body.content.category),
        description: req.body.content.description,
        title: req.body.content.title,
        content: req.body.content.content,
        blogimg: req.body.content.blogImg,
        kwlist: req.body.content.kwlist
    };
    for (const key in saveObj) {
        if (!saveObj[key]) {
            delete saveObj[key];
        }
    }
    await models.BLOG.update(
        saveObj,
        {
            where: {
                slug: req.param('blogslug'),
            }
        }
    );
    var blog = await models.BLOG.findOne({
        where: {
            slug: saveObj.slug,
        }
    })
    await models.TAG_BLOG.destroy({
        where: {
            BLOGId: blog.id,
        }
    });
    var tags = await models.TAG.findAll();
    var tagsArr = req.body.content.tags.split('#').filter((val, index) => {
        return val != ''
    }).map((val, index) => {
        return val.trim()
    });
    var tags = tags.filter((valraw, index) => {
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
    console.log(blog);
}
exports.getAdminAddBlog = async function (req, res, next) {
    var categories = await models.CATEGORY.findAll();
    var tags = await models.TAG.findAll();
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
    var tags = await models.TAG.findAll();
    var tagsArr = req.body.content.tags.split('#').filter((val, index) => {
        return val != ''
    }).map((val, index) => {
        return val.trim()
    });
    var tags = tags.filter((valraw, index) => {
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
