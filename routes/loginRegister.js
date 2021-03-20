var express = require('express');
var router = express.Router();
let loginRegister = require('../controllers/loginRegisterPage')
/* GET home page. */
router.get('/login', loginRegister.get_loginPage);
router.get('/register', loginRegister.get_registerPage);
module.exports = router;