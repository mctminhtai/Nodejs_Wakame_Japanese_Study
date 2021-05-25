var express = require('express');
var router = express.Router();
var checkAuth = require('../validate_func/CheckAuth');
var adminCtrl = require('../controllers/adminCtrl');
router.get('/admin', checkAuth.checkAuthenticated, adminCtrl.getAdminPage);
router.get('/admin/manageBlog', checkAuth.checkAuthenticated, adminCtrl.getAdminManagBlog);
router.get('/admin/addBlog', checkAuth.checkAuthenticated, adminCtrl.getAdminAddBlog);
module.exports = router;