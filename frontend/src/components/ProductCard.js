import React from 'react';
import { Link } from 'react-router-dom';  // For navigation
import {  FaEdit, FaTrash } from 'react-icons/fa';

// Function to format the date to '31-Mar-2025 3:08 PM'
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {  // 'en-GB' for DD-MMM-YYYY format
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,  // for AM/PM format
    });
};

// Function to determine product status based on quantity
const getProductStatus = (quantity) => {
    return quantity > 0 ? "In Stock" : "Out of Stock";
};

// Component for a single product card
const ProductCard = ({ product, onDelete }) => {
    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product Item ?");
        if (!confirmDelete) return;
        onDelete(product._id);
    };

    return (
        <div className="border bg-gray-200 border-gray-400 rounded-md p-3 mb-4 max-w-xs w-full h-auto">
            {/* Product Name */}
            <h2 className="text-lg uppercase text-yellow-600 font-semibold mb-3">{product.name}</h2>

            {/* Display Image */}
            {product.image && (
                <img
                    src={product.image}  // Assuming image path is stored relative to the public folder
                    alt={product.name}
                    className="mb-3 w-auto h-20 object-cover "  // Smaller image size
                />
            )}

            {/* Quantity */}
            <p className="text-black-400"><strong>Quantity:</strong> {product.quantity}</p>

            {/* Model Number */}
            <p className="text-black-600"><strong>Model No:</strong> {product.sku}</p>

            {/* Product AddOn Date */}
            <p className="text-black-600"><strong>Added On:</strong> {formatDate(product.dateAdded)}</p>

            {/* Product Status */}
            <p className={`font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Status:</strong> {getProductStatus(product.quantity)}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between mt-3">
    {/* Edit Button */}
    <Link
        to={`/products/edit-product/${product._id}`}
        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-200"
    >
        <FaEdit className="text-white" />
        Edit
    </Link>

    {/* Delete Button */}
    <button
        onClick={handleDelete}
        className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-200"
    >
        <FaTrash className="text-white" />
        Delete
    </button>
</div>

        </div>
    );
};

export default ProductCard;
