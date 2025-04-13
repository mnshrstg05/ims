const Inventory = require('../models/InventoryModel');
const Product = require('../models/ProductModel');  // Import the Product model for population

// Get all inventory items
const getAllInventory = async (req, res) => {
    try {
        const inventoryItems = await Inventory.find().populate('product');  // Populate the product field
        res.json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single inventory item by ID
const getInventoryById = async (req, res) => {
    try {
        const inventoryItem = await Inventory.findById(req.params.id).populate('product');  // Populate the product field
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new inventory item
const createInventory = async (req, res) => {
    try {
        const { product, quantityInStock,quantityOutStock } = req.body;

        if (!product || !quantityInStock || quantityInStock <= 0 || quantityOutStock < 0) {
            return res.status(400).json({ message: 'Product, quantityInStock, and quantityOutStock are required' });
        }

        // Check if the product exists in the Product collection
        const foundProduct = await Product.findById(product);
        if (!foundProduct) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }

        const newInventoryItem = new Inventory({ product, quantityInStock, quantityOutStock});
        const savedInventoryItem = await newInventoryItem.save();
        res.status(201).json(savedInventoryItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an inventory item
const updateInventory = async (req, res) => {
    try {
        const { product, quantityInStock, quantityOutStock } = req.body;

        if (!product || !quantityInStock || !quantityOutStock) {
            return res.status(400).json({ message: 'Product and quantityInStock are required' });
        }

        // Find the inventory item by ID and update it
        const updatedInventoryItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            { product, quantityInStock, quantityOutStock },
            { new: true, runValidators: true } // Ensure the updated item is returned
        ).populate('product');

        if (!updatedInventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.json(updatedInventoryItem); // Send the updated inventory item as a response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Delete an inventory item
const deleteInventory = async (req, res) => {
    try {
        const deletedInventoryItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedInventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
};
