const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, required: true }, // Image field to store image URL or file path
    dateAdded: {  type: String, required: true }, // Manual dateAdded field (optional)
},
// { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;