// models/VoucherModel.js
const mongoose = require('mongoose');
const Product = require('./ProductModel'); // Import the Product Model

// Define the Voucher Schema
const voucherSchema = new mongoose.Schema({
    voucherNumber: { type: String, required: true ,unique: true },
    dateOfDelivery: { type: Date, required: true },
    senderDetails: {
        name: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        warehouse: { type: String, required: true },
        location: { type: String, required: true }
    },
    receiverDetails: {
        name: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        warehouse: { type: String, required: true },
        location: { type: String, required: true }
    },
    goods: [{
        productName: { type: String, required: true },
        quantitySent: { type: Number, required: true },
        boxNumber: { type: String, required: true }
    }],
    remarks: { type: String, required: false }
});

// Pre-save hook to auto-generate voucher number
voucherSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const voucherPrefix = 'IDV';

            // Find all vouchers and extract numeric part
            const vouchers = await this.constructor.find({}, 'voucherNumber');
            
            const numbers = vouchers
                .map(v => {
                    const match = v.voucherNumber.match(/^IDV(\d+)$/);
                    return match ? parseInt(match[1], 10) : null;
                })
                .filter(n => n !== null);

            const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;

            this.voucherNumber = `${voucherPrefix}${maxNumber + 1}`;
        } catch (error) {
            console.error('Error generating voucher number:', error);
            return next(error);
        }
    }
    next();
});



// Create the Voucher model
const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
