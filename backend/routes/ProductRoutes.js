const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Routes for products
router.get('/all-products', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/create-product', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
