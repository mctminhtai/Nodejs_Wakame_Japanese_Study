var express = require('express');
var router = express.Router();
let newsPage = require('../controllers/newsPage');
/* GET home page. */
router.get('/', newsPage.get_newsPage);
module.exports = router;