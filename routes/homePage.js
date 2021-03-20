var express = require('express');
var router = express.Router();
let homePage = require('../controllers/homePage')
/* GET home page. */
router.get('/', homePage.get_homePage);
module.exports = router;