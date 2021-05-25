var express = require('express');
var router = express.Router();
var checkAuth = require('../validate_func/CheckAuth');
let homePage = require('../controllers/homePage');
const { check } = require('express-validator');
/* GET home page. */
router.get('/', homePage.get_homePage);
router.get('/about', homePage.get_aboutPage);
router.get('/contact', homePage.get_contactPage);
router.get('/courses', homePage.get_coursesPage);
router.get('/profile', checkAuth.checkAuthenticated, homePage.get_profilePage);
router.post('/profile', homePage.post_profileEditPage);
router.get('/coursesdetail', homePage.get_coursesDetailPage);
router.get('/tkb', homePage.get_tkbPage);
router.get('/books', homePage.get_booksPage);
router.get('/booksdetail', homePage.get_booksdetailPage);
router.get('/example', homePage.get_profileEditPage);

module.exports = router;