const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/', salesController.getAllSales);
router.post('/checkout', salesController.createReceipt);
router.post('/sales-return', salesController.createRefund);

module.exports = router;