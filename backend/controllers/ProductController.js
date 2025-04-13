const Product = require('../models/ProductModel');
const multer = require('multer');
const path = require('path');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Set file size limit (10MB in this case)
    fileFilter: (req, file, cb) => {
        // Ensure file is an image (optional)
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb(new Error('Only image files are allowed'));
        }
    }
}).single('image'); // Make sure the field name is 'image'

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to create a product
const createProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image: ' + err.message });
        }

         const { name, description, sku, quantity, price, category,dateAdded } = req.body;
        
        // Ensure req.file exists and store the image path
        const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const newProduct = new Product({
            name,
            description,
            sku,
            quantity,
            price,
            category,
            image: imagePath , // Store image path in the database
            dateAdded
        });

        try {
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};



// Controller to update the product
const updateProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading image: ' + err.message });
        }

        try {
            const { id } = req.params;
            const { name, description, sku, price, quantity, category } = req.body;

            // Find the product by ID
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Update the product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.sku = sku || product.sku;
            product.price = price || product.price;
            product.quantity = quantity || product.quantity;
            product.category = category || product.category;

            // Handle image upload (only if a new image is provided)
            if (req.file) {
                product.image = req.file.path.replace(/\\/g, '/');  // Ensure correct path format for the image
            }

            // Save the updated product
            await product.save();
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).json({ message: 'Error updating product' });
        }
    });
};




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
