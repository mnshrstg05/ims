import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInventory = () => {
            axios.get('https://ims-3cdk.onrender.com/inventory/all-inventory')
                .then(response => {
                    setProducts(response.data);
                })
                .catch(error => {
                    console.error('Error fetching inventory items:', error);
                    setError('Error fetching inventory items. Please try again later.');
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadInventory);
        } else {
            loadInventory();
        }
    }, []);

    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Inventory record?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`https://ims-3cdk.onrender.com/inventory/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <h1 className="text-3xl text-teal-700 font-bold">Stock Report</h1>
                <Link
                    to="/inventory/add-product"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    ADD INVENTORY 
                </Link>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead className="bg-teal-600 text-white">
                        <tr>
                            <th className="border px-2 py-2 text-xs">Sn No</th>
                            <th className="border px-2 py-2 text-xs">Product Name</th>
                            <th className="border px-2 py-2 text-xs">Image</th>
                            <th className="border px-2 py-2 text-xs">InStock Quantity</th>
                            <th className="border px-2 py-2 text-xs">Stock Out</th>
                            <th className="border px-2 py-2 text-xs">Date</th>
                            <th className="border px-2 py-2 text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(6)].map((_, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    {[...Array(7)].map((__, i) => (
                                        <td key={i} className="border px-2 py-4">
                                            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No inventory records found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product, index) => (
                                <tr
                                    key={product._id}
                                    className={`transition-opacity duration-300 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                    }`}
                                >
                                    <td className="border px-2 py-2 text-xs text-center">{index + 1}</td>
                                    <td className="border px-2 py-2 text-xs uppercase text-yellow-800 font-bold">
                                        {product.product?.name || 'N/A'}
                                    </td>
                                    <td className="border px-2 py-2 text-center">
                                        {product.product?.image ? (
                                            <div className="group relative">
                                                <img
                                                    src={`https://ims-3cdk.onrender.com/${product.product?.image}`}
                                                    alt={product.product?.name}
                                                    className="h-14 object-cover transition-transform duration-300 group-hover:scale-150"
                                                />
                                            </div>
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td className="border px-2 py-2 text-sm text-center">
                                        {product.quantityInStock === 0 ? 'Out of Stock' : product.quantityInStock}
                                    </td>
                                    <td className="border px-2 py-2 text-sm text-center">{product.quantityOutStock}</td>
                                    <td className="border px-2 py-2 text-xs text-center">
                                        {product.lastRestockedDate
                                            ? new Date(product.lastRestockedDate).toLocaleDateString('en-GB', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : 'N/A'}
                                    </td>
                                    <td className="border px-2 py-2">
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                            <Link
                                                to={`/inventory/edit/${product._id}`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 px-4 rounded flex items-center gap-1"
                                            >
                                                <FaEdit /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded flex items-center gap-1"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryPage;
