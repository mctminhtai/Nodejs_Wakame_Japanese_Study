var express = require('express');
var router = express.Router();
var adminCtrl = require('../controllers/adminCtrl');
router.get('/admin', adminCtrl.getAdminPage);
router.get('/admin/manageBlog', adminCtrl.getAdminManagBlog);
router.get('/admin/addBlog', adminCtrl.getAdminAddBlog);
module.exports = router;