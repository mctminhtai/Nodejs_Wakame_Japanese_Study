
const cookieParser = require('cookie-parser');
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
exports.get_blogDetailPage = function (req, res, next) {
    var xacnhan = false;
    try{
    models.BLOG.findAll({ attributes: ['title', 'content', 'USERId','createdAt'], include: ['blog_user', 'blog_tag'] }).then((all) => {
        
        var list_blog = [];
        var tieu_de_blog = {
            title: undefined,
            content: undefined,
            ten_ng_dang: undefined,
            time_dang: undefined,
        };
        var tag_cua_blog = [];
    
        all.forEach((item, index) => {

            tieu_de_blog.title = item.dataValues.title;
            tieu_de_blog.content = item.dataValues.content;
            tieu_de_blog.ten_ng_dang = item.dataValues.blog_user.dataValues.fullName;
            tieu_de_blog.time_dang=item.dataValues.createdAt;
            list_blog.push(tieu_de_blog);
        });
        models.TAG_BLOG.findAll({ attributes: ['TAGId', 'BLOGId'], include: ['tag_blog_tag', 'tag_blog_blog'] }).then((all) => {
            
            var tags_blog = [];
            all.forEach((item, index) => {
                tags_blog.push(item.dataValues.tag_blog_tag.TEN_TAG);
            });
            models.TAG.findAll({ attributes: ['TEN_TAG'] }).then((all) => {
                var tags_all = [];
                all.forEach((item, index) => {
                    tags_all.push(item.dataValues.TEN_TAG);

                });

                if (req.isAuthenticated()) {
                    xacnhan = true;
                    return res.render('blog_details', { title: 'Express', Authenticated: xacnhan, user_name: req.user.dataValues.fullName, blogs: list_blog[0], tags_blog: tags_blog, list_tag: tags_all });
                }
                else {
                    return res.render('blog_details', { title: 'Express', Authenticated: xacnhan, blogs: list_blog[0], tags_blog: tags_blog, list_tag: tags_all });
                 } 
                
               
            });


        });

    });
    }
    catch(err){
        return res.render('blog_details', { title: 'Express', Authenticated: false, blogs: undefined, tags_blog: undefined, list_tag: undefined });
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