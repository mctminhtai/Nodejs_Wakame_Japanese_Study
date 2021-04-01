var express = require('express');
var router = express.Router();
let homePage = require('../controllers/homePage')
/* GET home page. */
router.get('/', homePage.get_homePage);
router.get('/about', homePage.get_aboutPage);
router.get('/blog', homePage.get_blogPage);
router.get('/blogdetail', homePage.get_blogDetailPage);
router.get('/contact', homePage.get_contactPage);
router.get('/courses', homePage.get_coursesPage);
module.exports = router;