const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, buyerController.searchProducts);
router.post('/rice-mills', protect, buyerController.getNearbyRiceMills);
router.post('/bid', protect, buyerController.placeBid);
router.post('/payment', protect, buyerController.proceedToPayment);
router.get('/bid-summary', protect, buyerController.getBidSummary);
router.post('/confirm-delivery', buyerController.confirmDelivery);


module.exports = router;
