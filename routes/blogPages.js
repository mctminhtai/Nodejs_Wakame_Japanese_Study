var express = require('express');
var router = express.Router();
var blogPage = require('../controllers/blogCtrl');
router.get('/blog', blogPage.get_blogPage);
router.get('/blog-search', blogPage.get_searchBlogPage);
router.get('/blog/:slug', blogPage.get_blogDetailPage);
router.post('/blog/post_comment', blogPage.post_blogcmDetailPage);
module.exports = router;