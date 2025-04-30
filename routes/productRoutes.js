const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth'); 

router.post('/', protect, productController.addProduct);
router.put('/:id', protect, productController.editProduct);
router.patch('/mark-available/:id', protect, productController.markAvailable);
router.get('/dashboard', protect, productController.getDashboard);
router.post('/send-otp', productController.sendPickupOTP);
module.exports = router;
