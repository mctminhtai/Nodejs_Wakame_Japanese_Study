var express = require('express');
var router = express.Router();
let webhook = require('../controllers/webhookCtrl')
/* GET home page. */
router.get('/', webhook.get_webhook);
router.get('/backupandrestore', webhook.get_whBackupRestore);
router.post('/', webhook.post_webhook);
module.exports = router;