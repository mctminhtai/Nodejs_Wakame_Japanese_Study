const models = require('../models');

exports.get_homePage = function (req, res, next) {
    var xacnhan = false;

    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('index', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else {
        return res.render('index', { title: 'Express', Authenticated: xacnhan });
    }

}
exports.get_aboutPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('about', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else {
        return res.render('about', { title: 'Express', Authenticated: xacnhan });
    }

}
exports.get_blogPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('blog', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else {
        return res.render('blog', { title: 'Express', Authenticated: xacnhan });
    }
}
exports.get_blogDetailPage = async function (req, res, next) {
    var uuid = req.param('uuid');
    var blog = await models.BLOG.findOne({
        attributes: ['id', 'USERId', 'title', 'content', 'createdAt'],
        where: { uuid: uuid },
        include: ['blog_user', 'blog_tag']
    });
    var tags = await models.TAG.findAll({
        attributes: ['TEN_TAG']
    });
    console.log(blog, tags);
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('blog_details', {
            title: 'Express',
            Authenticated: xacnhan,
            user_name: req.user.dataValues.fullName,
        });
    }
    else {
        var xacnhan = false;
        return res.render('blog_details', {
            title: 'Express',
            Authenticated: xacnhan,
        });
    }
}

exports.get_contactPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('contact', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else {
        return res.render('contact', { title: 'Express', Authenticated: xacnhan });
    }
}
exports.get_coursesPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('courses', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else { return res.render('courses', { title: 'Express', Authenticated: xacnhan }); }

}

exports.get_profilePage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('profile', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else { return res.render('profile', { title: 'Express', Authenticated: xacnhan }); }

}

exports.get_editPage = function (req, res, next) {
    var xacnhan = false;
    if (req.isAuthenticated()) {
        xacnhan = true;
        return res.render('edit', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName });
    }
    else { return res.render('edit', { title: 'Express', Authenticated: xacnhan }); }

}
