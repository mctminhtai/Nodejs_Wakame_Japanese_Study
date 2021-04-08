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
    body('name', 'tên phải lớn hơn 5 ký tự').isLength({ min: 5 }),
    body('email', 'email chưa đúng định dạng').isEmail().normalizeEmail(),
    body('terms', 'chưa đồng ý thoả thuận người dùng').exists(),
    body('password', 'password phải từ 8 ký tự trở lên').isLength({ min: 8 }),
    body('re_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('mật khẩu xác nhận và mật khẩu không khớp');
        }
        return true;
    }),
    validate.checkErr,
    passport.authenticate(
        'local.signup',
        { successRedirect: '/', failureRedirect: '/register', failureFlash: false }
    )
);
router.get('/logout', loginRegister.get_logout);
router.get('/test', loginRegister.get_test);
module.exports = router;