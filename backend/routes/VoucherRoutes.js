const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/VoucherController');

// Get all vouchers
router.get('/get-vouchers', voucherController.getAllVouchers);

// Get voucher by ID
router.get('/vouchers/:id', voucherController.getVoucherById);

// Route to fetch all product names
router.get('/get-products', voucherController.getAllProducts);

// Create a new voucher
router.post('/create-voucher', voucherController.createVoucher);

// Update an existing voucher
router.put('/vouchers/:id', voucherController.updateVoucher);

// Delete a voucher
router.delete('/delete-voucher/:id', voucherController.deleteVoucher);

// Route to generate voucher number
router.get('/generate-voucher-number', voucherController.generateVoucherNumber);

module.exports = router;
