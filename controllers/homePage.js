const models = require('../models');

exports.get_homePage = function (req, res, next) {
    var xacnhan = false;

    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('index', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, email_user: req.user.dataValues.email });
    }
    else {
        return res.render('index', { title: 'Express', Authenticated: xacnhan });
    }

}
exports.get_aboutPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('about', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, email_user: req.user.dataValues.email });
    }
    else {
        return res.render('about', { title: 'Express', Authenticated: xacnhan });
    }

}
exports.get_blogPage = async function (req, res, next) {
    var blogs = await models.BLOG.findAll({
        attributes: ['uuid', 'title', 'blogimg', 'content', 'description', 'createdAt'],
        include: ['blog_user'],
    });
    var tags = await models.TAG.findAll({
        attributes: ['TEN_TAG']
    });
    console.log(blogs);
    return res.render('blog', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        blogs: blogs,
        tags: tags,
    });
}
exports.get_blogDetailPage = async function (req, res, next) {
    var uuid = req.param('uuid');
    var blog = await models.BLOG.findOne({
        attributes: ['id', 'USERId', 'blogimg', 'title', 'content', 'createdAt'],
        where: { uuid: uuid },
        include: ['blog_user', 'blog_tag', 'blog_comment']
    });
    var tags = await models.TAG.findAll({
        attributes: ['TEN_TAG']
    });
    var users = await models.USER.findAll({
        attributes: ['id', 'fullName'],
    })
    console.log(blog.blog_comment);
    return res.render('blog_details', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        blog: blog,
        tags: tags,
    })
}

exports.get_contactPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('contact', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, email_user: req.user.dataValues.email });
    }
    else {
        return res.render('contact', { title: 'Express', Authenticated: xacnhan });
    }
}
exports.get_coursesPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('courses', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, email_user: req.user.dataValues.email });
    }
    else { return res.render('courses', { title: 'Express', Authenticated: xacnhan }); }

}

exports.get_profilePage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('profile', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, email_user: req.user.dataValues.email });
    }
    else { return res.render('profile', { title: 'Express', Authenticated: xacnhan }); }

}

exports.get_editPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('edit', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, email_user: req.user.dataValues.email });
    }
    else { return res.render('edit', { title: 'Express', Authenticated: xacnhan }); }

}
