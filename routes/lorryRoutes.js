const express = require('express');
const router = express.Router();
const lorryCtrl = require('../controllers/lorryController');

router.post('/register', lorryCtrl.registerLorry);
router.post('/login', lorryCtrl.loginLorry);
router.post('/notify', lorryCtrl.notifyLogistics);
router.post('/accept', lorryCtrl.acceptOrder);
router.post('/update-gps', lorryCtrl.updateGPS);
router.post('/verify-otp', lorryCtrl.verifyOTP);

module.exports = router;
