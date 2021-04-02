var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginRegister = require('../controllers/loginRegisterPage');
var checkAuth = require('../validate_func/CheckAuth');
var validate = require('../validate_func/Validate');
const { body } = require('express-validator');
/* GET home page. */
router.get('/login', checkAuth.checkNotAuthenticated, loginRegister.get_loginPage);
router.post(
    '/login',
    body('email').isEmail().normalizeEmail(),
    passport.authenticate(
        'local.login',
        { successRedirect: '/', failureRedirect: '/login', failureFlash: false }));
router.get('/register', checkAuth.checkNotAuthenticated, loginRegister.get_registerPage);
//router.post('/register', loginRegister.post_registerPage);
router.post(
    '/register',
    body('name').isLength({ min: 5 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('re_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    validate.valiReg,
    passport.authenticate(
        'local.signup',
        { successRedirect: '/', failureRedirect: '/register', failureFlash: false }
    )
);
router.get('/logout', loginRegister.get_logout);
router.get('/test', loginRegister.get_test);
module.exports = router;