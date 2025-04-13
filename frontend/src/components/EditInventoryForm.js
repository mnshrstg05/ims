import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaEdit } from 'react-icons/fa';

const EditInventoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        product: '',
        quantityInStock: '',
        quantityOutStock: ''
    });
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://ims-3cdk.onrender.com/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });

        axios.get(`https://ims-3cdk.onrender.com/inventory/${id}`)
            .then(response => {
                setProduct({
                    product: response.data.product?._id || '',
                    quantityInStock: response.data.quantityInStock || '',
                    quantityOutStock: response.data.quantityOutStock || ''
                });
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching inventory item');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.product || !product.quantityInStock || !product.quantityOutStock) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await axios.put(`https://ims-3cdk.onrender.com/inventory/${id}`, product);
            navigate('/inventory');
        } catch (err) {
            setError('Error updating inventory item');
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-lg text-gray-600">Loading...</div>;
    }

    return (
        <div className="min-h-auto bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-gray-300 shadow-xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-yellow-600 mb-8 flex items-center justify-center gap-2">
                    <FaEdit className="text-indigo-600" /> Edit Inventory Item
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Product selection */}
                    <div>
                        <label className="block text-1xl font-bold text-teal-700 mb-2">Product</label>
                        <select
                            value={product.product}
                            onChange={(e) => setProduct({ ...product, product: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))
                            ) : (
                                <option value="">No products available</option>
                            )}
                        </select>
                    </div>

                    {/* Quantity In Stock */}
                    <div>
                        <label className="block text-1xl font-bold text-teal-600 mb-2">Quantity In Stock</label>
                        <input
                            type="number"
                            value={product.quantityInStock}
                            onChange={(e) => setProduct({ ...product, quantityInStock: e.target.value })}
                            placeholder="Total quantity in stock"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            required
                        />
                    </div>

                    {/* Quantity Out of Stock */}
                    <div>
                        <label className="blocktext-1xl font-bold text-teal-600 mb-2">Quantity Out of Stock</label>
                        <input
                            type="number"
                            value={product.quantityOutStock}
                            onChange={(e) => setProduct({ ...product, quantityOutStock: e.target.value })}
                            placeholder="Remaining quantity"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
    <button
        type="submit"
        className="w-full sm:w-auto bg-indigo-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2 transition"
    >
        <FaSave /> Update Inventory
    </button>
    <button
        type="button"
        onClick={() => navigate('/inventory')}
        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md font-semibold transition"
    >
        Cancel
    </button>
</div>

                </form>
            </div>
        </div>
    );
};

export default EditInventoryForm;
