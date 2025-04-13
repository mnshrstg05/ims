const Voucher = require('../models/VoucherModel'); // Import Voucher model
const Product = require('../models/ProductModel');  // Import Product Model
const Inventory = require('../models/InventoryModel'); // ✅ Add Inventory import

// Get all vouchers
const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find(); // Assuming you're using a database like MongoDB
        res.json(vouchers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vouchers' });
    }
};

// Controller to get all product names
const getAllProducts = async (req, res) => {
    try {
        // Fetch only the 'name' field from the Product model
        const products = await Product.find().select('name');  // Select only the 'name' field
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get voucher by ID
const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }
        res.json(voucher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVoucher = async (req, res) => {
    try {
    
        const { voucherNumber, senderDetails, receiverDetails, goods, remarks, dateOfDelivery } = req.body;

        // If dateOfDelivery is not provided, set it to the current date and time
        const currentDate = new Date(); // Get the current date and time

        // Use provided date or current date if not provided
        const voucherDate = dateOfDelivery || currentDate.toISOString();

        // Check if the voucher number already exists in the database
        const existingVoucher = await Voucher.findOne({ voucherNumber });
        if (existingVoucher) {
            return res.status(400).json({ message: 'Voucher number already exists.' });
        }

        // Make sure all required fields are present
        if (!voucherNumber || !senderDetails || !receiverDetails || !goods || !voucherDate) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Make sure that all goods fields are valid
        for (let item of goods) {
            if (!item.productName || item.quantitySent <= 0 || !item.boxNumber) {
                return res.status(400).json({ message: 'Goods information is incomplete or invalid.' });
            }
        }

        const newVoucher = new Voucher({
            voucherNumber,
            senderDetails,
            receiverDetails,
            goods,
            remarks,
            dateOfDelivery: voucherDate  // Use the current date if not provided
        });

        const savedVoucher = await newVoucher.save();

        // 🔄 Update inventory quantities
        for (let item of goods) {
            const { productName, quantitySent } = item;
        
            // Step 1: Find the Product
            const product = await Product.findOne({ name: productName });
            if (!product) {
                console.warn(`Product not found: ${productName}`);
                continue;
            }
        
            // Step 2: Get Inventory
            let inventoryItem = await Inventory.findOne({ product: product._id });
        
            if (!inventoryItem) {
                // If inventory doesn't exist, create new
                inventoryItem = new Inventory({
                    product: product._id,
                    quantityInStock: 0,
                    quantityOutStock: quantitySent,  // Start with quantity sent
                    lastRestockedDate: new Date()
                });
            } else {
                // Update existing inventory
               
                
        
                inventoryItem.quantityInStock = Math.max(0, inventoryItem.quantityInStock - quantitySent);
                inventoryItem.quantityOutStock = Number(inventoryItem.quantityOutStock || 0) + Number(quantitySent);
                inventoryItem.lastRestockedDate = new Date();
            }
        
            await inventoryItem.save();
        
        }
        
        

        

        res.status(200).json({ message: 'Voucher created successfully', voucher: savedVoucher });
    } catch (error) {
        console.error('Error creating voucher:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Voucher validation failed',
                errors: error.errors // this will give specific field errors
            });
        }

        res.status(500).json({ message: 'Internal server error' });
    }
};




// Update an existing voucher
const updateVoucher = async (req, res) => {
    try {
        const updatedVoucher = await Voucher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedVoucher) {
            return res.status(404).json({ message: 'Voucher not found' });
        }

        res.json(updatedVoucher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a voucher
const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        await Voucher.findByIdAndDelete(id); // Assuming you're using a MongoDB database
        res.json({ message: 'Voucher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting voucher' });
    }
};


// Controller to generate a voucher number
const generateVoucherNumber = async (req, res) => {
    try {
        const vouchers = await Voucher.find({}, 'voucherNumber'); // only fetch voucherNumber field

        const voucherPrefix = 'IDV';

        const numbers = vouchers
            .map(v => {
                const match = v.voucherNumber.match(/^IDV(\d+)$/);
                return match ? parseInt(match[1], 10) : null;
            })
            .filter(num => num !== null);

        const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
        const newVoucherNumber = `${voucherPrefix}${maxNumber + 1}`;

        return res.json({ voucherNumber: newVoucherNumber });
    } catch (error) {
        console.error('Error generating voucher number:', error);
        return res.status(500).json({ message: 'Error generating voucher number' });
    }
};






module.exports = {
    getAllVouchers,
    getVoucherById,
    createVoucher,
    updateVoucher,
    getAllProducts,
    deleteVoucher,
    generateVoucherNumber,
};
