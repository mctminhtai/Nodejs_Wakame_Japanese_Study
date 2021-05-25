const models = require('../models');
const search = require('../utils/multiSearch');
exports.get_blogPage = async function (req, res, next) {
    req.session.redirectTo = '/blog';
    var page = req.query.page || 1;
    var itemPerPage = 4;
    var begin = (page - 1) * itemPerPage;
    var end = page * itemPerPage;
    var blogs = await models.BLOG.findAll({
        attributes: ['uuid', 'slug', 'title', 'blogimg', 'content', 'description', 'createdAt'],
        include: ['blog_user', 'blog_comment'],
    });
    var tags = await models.TAG.findAll({
        attributes: ['TEN_TAG']
    });
    var categories = await models.CATEGORY.findAll({
        include: ['category_blog']
    });
    var numOfPage = Math.ceil(blogs.length / itemPerPage);
    return res.render('blog', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        blogs: blogs,
        begin: begin,
        end: end,
        tags: tags,
        categories: categories,
        numOfPage: numOfPage,
    });
}
exports.get_searchBlogPage = async function (req, res, next) {
    var words = req.query.q ? req.query.q.split(" ") : '';
    var itemPerPage = 4;
    var page = req.query.page || 1;
    var begin = (page - 1) * itemPerPage;
    var end = page * itemPerPage;
    var category = req.query.category ? req.query.category : '';
    //console.log(category);
    var blogs = [];
    var foundBlogs = [];
    if (words.length > 0) {
        blogs = await models.BLOG.findAll({
            attributes: ['uuid', 'slug', 'title', 'blogimg', 'content', 'description', 'createdAt'],
            include: ['blog_user', 'blog_comment'],
        });
        blogs.forEach((blog) => {
            //console.log(search.multiSearchOr(blog.title, words))
            if (search.multiSearchOr(blog.title, words) == "Found!") {
                foundBlogs.push(blog);
            }
        });
    }
    if (category) {
        blogs = await models.BLOG.findAll({
            attributes: ['uuid', 'slug', 'title', 'blogimg', 'content', 'description', 'createdAt'],
            include: [
                'blog_user',
                'blog_comment',
                {
                    model: models.CATEGORY,
                    as: 'blog_category',
                    where: {
                        name: category,
                    }
                }
            ],
        });
        foundBlogs = blogs;
    }

    var categories = await models.CATEGORY.findAll({
        include: ['category_blog']
    });

    var tags = await models.TAG.findAll({
        attributes: ['TEN_TAG']
    });
    var numOfPage = Math.ceil(foundBlogs.length / itemPerPage);
    return res.render('blog', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        blogs: foundBlogs,
        begin: begin,
        end: end,
        tags: tags,
        categories: categories,
        numOfPage: numOfPage,
    });
}

exports.get_blogDetailPage = async function (req, res, next) {
    var slug = req.param('slug');
    var blogs = await models.BLOG.findAll({
        attributes: ['uuid', 'slug', 'title', 'blogimg', 'content', 'description', 'createdAt'],
        include: ['blog_user', 'blog_comment'],
    });
    var blog = await models.BLOG.findOne({
        //attributes: ['id', 'USERId', 'blogimg', 'title', 'content', 'createdAt'],
        where: { slug: slug },
        include: ['blog_user', 'blog_tag']
    });
    var tags = await models.TAG.findAll({
        attributes: ['TEN_TAG']
    });
    var comments = await models.COMMENT.findAll({
        where: { BLOGId: blog.id },
        include: ['comment_user'],
    });
    var categories = await models.CATEGORY.findAll({
        include: ['category_blog']
    });
    req.session.redirectTo = '/blog/' + blog.slug;
    return res.render('blog_details', {
        Authenticated: req.isAuthenticated(),
        user_name: req.isAuthenticated() ? req.user.dataValues.fullName : '',
        user_email: req.isAuthenticated() ? req.user.dataValues.email : '',
        blog: blog,
        blogs: blogs,
        tags: tags,
        comments: comments,
        categories: categories,
    })
}
exports.post_blogcmDetailPage = async function (req, res, next) {
    var blog = await models.BLOG.findOne({
        //attributes: ['id', 'USERId', 'blogimg', 'title', 'content', 'createdAt'],
        where: { uuid: req.body.bloguuid },
    });
    var user = await models.USER.findOne({
        where: { email: req.body.useremail },
    });
    await models.COMMENT.create({
        BLOGId: blog.id,
        USERId: user.id,
        cmcontent: req.body.comment,
    });
    return res.redirect('/blog/' + req.body.bloguuid);
}