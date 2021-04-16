var express = require('express');
var router = express.Router();
var passport = require('passport');
var loginRegister = require('../controllers/loginRegisterPage');
var checkAuth = require('../validate_func/CheckAuth');
var validate = require('../validate_func/Validate');
const { body } = require('express-validator');
/* GET home page. */
router.get('/accounts', checkAuth.checkNotAuthenticated, loginRegister.get_accountsPage);
router.post(
    '/login',
    body('email', 'Email không đúng định dạng').isEmail(),
    validate.checkErr,
    passport.authenticate(
        'local.login',
        { successRedirect: '/', failureRedirect: '/accounts', failureFlash: false }));

router.post(
    '/register',
    body('name', 'tên phải lớn hơn 5 ký tự').isLength({ min: 5 }),
    body('email', 'email chưa đúng định dạng').isEmail(),
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
        { successRedirect: '/', failureRedirect: '/accounts', failureFlash: false }
    )
);
router.get('/logout', loginRegister.get_logout);
router.get('/pwd_reset', loginRegister.get_resetToken);
router.post('/pwd_reset', loginRegister.post_resetToken);
router.get('/pwd_reset/:token', loginRegister.get_resetPwd);
router.post(
    '/pwd_reset/:token',
    body('password', 'password phải từ 8 ký tự trở lên').isLength({ min: 8 }),
    body('re_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('mật khẩu xác nhận và mật khẩu không khớp');
        }
        return true;
    }),
    validate.ResetPwd_checkErr,
    loginRegister.post_resetPwd);
router.get('/test', loginRegister.get_test);
router.get('/captcha', loginRegister.get_captcha);
router.post('/captcha', loginRegister.post_captcha);
module.exports = router;