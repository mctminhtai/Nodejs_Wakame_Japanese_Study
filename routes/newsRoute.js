var express = require('express');
var router = express.Router();
let newsPage = require('../controllers/newsPageCtrl')
/* GET home page. */
router.get('/', newsPage.get_newsPage);
router.get('/world', newsPage.get_newsWorld);
module.exports = router;