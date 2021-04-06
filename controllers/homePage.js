
const models = require('../models');
exports.get_homePage = function (req, res, next) {
    var xacnhan=false;

    if (req.isAuthenticated()) {
        xacnhan=true;
        return res.render('index', { title: 'Express',Authenticated:xacnhan,user_name:req.user.dataValues.fullName});
    }
    else{
        return res.render('index', { title: 'Express',Authenticated:xacnhan});
    }
   
}
exports.get_aboutPage = function (req, res, next) {
    var xacnhan=false;
    if (req.isAuthenticated()) {
        xacnhan=true;
        return res.render('about', { title: 'Express',Authenticated:xacnhan ,user_name:req.user.dataValues.fullName});
    }
    else{
        return res.render('about', { title: 'Express',Authenticated:xacnhan});
    }

}
exports.get_blogPage = function (req, res, next) {
    var xacnhan=false;
    if (req.isAuthenticated()) {
        xacnhan=true;
        return res.render('blog', { title: 'Express',Authenticated:xacnhan,user_name:req.user.dataValues.fullName });
    }
    else{
    return res.render('blog', { title: 'Express',Authenticated:xacnhan });
}
}
exports.get_blogDetailPage = function (req, res, next) {
    var xacnhan=false;
 
    models.BLOG.findAll({ attributes: ['title', 'content', 'USERId'], include: ['nguoidang'] }).then((all) => {
          var list_blog=[]; 
          all.forEach((item, index) => {
            var tieu_de_blog={
                title:item.dataValues.title,
                content: item.dataValues.content,
                ten_ng_dang:item.dataValues.nguoidang.dataValues.fullName
            }
            list_blog.push(tieu_de_blog);
        }); 
        if (req.isAuthenticated()) {
            xacnhan=true;
            return res.render('blog_details', { title: 'Express',Authenticated:xacnhan,user_name:req.user.dataValues.fullName,blogs:list_blog });
        }
        else{
            return res.render('blog_details', { title: 'Express',Authenticated:xacnhan,blogs:list_blog });
        }
    });
   
    // if (req.isAuthenticated()) {
    //     xacnhan=true;
    //     return res.render('blog_details', { title: 'Express',Authenticated:xacnhan,user_name:req.user.dataValues.fullName });
    // }
    // else{
    //     return res.render('blog_details', { title: 'Express',Authenticated:xacnhan });
    // }

}
exports.get_contactPage = function (req, res, next) {
    var xacnhan=false;
    if (req.isAuthenticated()) {
        xacnhan=true;
        return res.render('contact', { title: 'Express',Authenticated:xacnhan,user_name:req.user.dataValues.fullName });
    }
    else{
     return res.render('contact', { title: 'Express' ,Authenticated:xacnhan});
    }
}
exports.get_coursesPage = function (req, res, next) {
    var xacnhan=false;
    if (req.isAuthenticated()) {
        xacnhan=true;
        return res.render('courses', { title: 'Express',Authenticated:xacnhan,user_name:req.user.dataValues.fullName });
    }
    else{  return res.render('courses', { title: 'Express',Authenticated:xacnhan });}
  
}
