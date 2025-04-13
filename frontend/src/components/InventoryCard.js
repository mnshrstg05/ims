import React from 'react';

const ProductCard = ({ product, onDelete }) => {
    const handleDelete = () => {
        onDelete(product._id);
    };

    return (
        <div className="border p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{product.name}</h2> {/* Access the name from the populated product */}
            <p><strong>Quantity in Stock:</strong> {product.quantityInStock}</p>
            <p><strong>Last Restocked:</strong> {new Date(product.lastRestockedDate).toLocaleDateString()}</p> {/* Format the date */}
            <button onClick={handleDelete} className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete
            </button>
        </div>
    );
};

export default ProductCard;
