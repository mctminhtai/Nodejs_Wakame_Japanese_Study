var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginRegister = require('../controllers/loginRegisterPage');
var checkAuth = require('../validate_func/CheckAuth');
/* GET home page. */
router.get('/login', checkAuth.checkNotAuthenticated, loginRegister.get_loginPage);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: false }));
router.get('/register', checkAuth.checkNotAuthenticated, loginRegister.get_registerPage);
router.post('/register', loginRegister.post_registerPage);
router.get('/logout', loginRegister.get_logout);
router.get('/test', loginRegister.get_test);
module.exports = router;