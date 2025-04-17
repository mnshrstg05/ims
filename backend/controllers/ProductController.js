// controllers/ProductController.js
const Product = require('../models/ProductModel');
const upload = require('../middleware/upload');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a product
const createProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload error: ' + err.message });
    }

    const { name, description, sku, quantity, price, category, dateAdded } = req.body;

    const imagePath = req.file ? req.file.path : null;

    const newProduct = new Product({
      name,
      description,
      sku,
      quantity,
      price,
      category,
      image: imagePath,
      dateAdded,
    });

    try {
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// Update a product
const updateProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload error: ' + err.message });
    }

    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const { name, description, sku, quantity, price, category } = req.body;

      product.name = name || product.name;
      product.description = description || product.description;
      product.sku = sku || product.sku;
      product.quantity = quantity || product.quantity;
      product.price = price || product.price;
      product.category = category || product.category;

      if (req.file) {
        product.image = req.file.path;
      }

      await product.save();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
