var express = require('express');
var router = express.Router();
let homePage = require('../controllers/homePage')
/* GET home page. */
router.get('/', homePage.get_homePage);
router.get('/about', homePage.get_aboutPage);
router.get('/blog', homePage.get_blogPage);
router.get('/blog-search', homePage.get_searchBlogPage);
//router.get('/blog-search/:category', homePage.get_searchCategoryBlogPage);
router.get('/blog/:uuid', homePage.get_blogDetailPage);
router.post('/blog/post_comment', homePage.post_blogcmDetailPage);
router.get('/contact', homePage.get_contactPage);
router.get('/courses', homePage.get_coursesPage);
router.get('/profile', homePage.get_profilePage);
router.get('/coursesdetail', homePage.get_coursesDetailPage);
router.get('/tkb', homePage.get_tkbPage);
router.get('/resetpw', homePage.get_resetpwPage);
router.get('/books', homePage.get_booksPage);
router.get('/booksdetail', homePage.get_booksdetailPage);
router.get('/example', homePage.get_profileEditPage);
router.post('/profile', homePage.post_profileEditPage);
module.exports = router;