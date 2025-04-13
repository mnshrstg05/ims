import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInventoryForm = () => {
    const [product, setProduct] = useState('');
    const [quantityInStock, setQuantityInStock] = useState('');
    const [quantityOutStock, setQuantityOutStock] = useState('');
    const [products, setProducts] = useState([]);
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setDate(new Date());

        axios.get('https://ims-3cdk.onrender.com/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return d.toLocaleString('en-US', options).replace(',', '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product || quantityInStock === '' || quantityOutStock === '') {
            alert('Please fill in all required fields');
            return;
        }

        const inventoryData = {
            product,
            quantityInStock: parseInt(quantityInStock, 10),
            quantityOutStock: parseInt(quantityOutStock, 10),
            lastRestockedDate: formatDate(date),
        };

        try {
            const response = await axios.post('https://ims-3cdk.onrender.com/inventory', inventoryData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                setProduct('');
                setQuantityInStock('');
                setQuantityOutStock('');
                navigate('/inventory');
            } else {
                alert('Error adding inventory item: ' + response.statusText);
            }
        } catch (error) {
            if (error.response) {
                alert('Error: ' + (error.response.data.message || error.response.statusText));
            } else if (error.request) {
                alert('No response from the server.');
            } else {
                alert('Error: ' + error.message);
            }
        }
    };

    return (
        <div className="min-h-auto  bg-gray-100 flex items-center justify-center px-4" >
            <div className="w-full max-w-4xl  bg-gray-300 shadow-xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-yellow-600 mb-8">Add New Inventory Item</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <select
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    >
                        <option value="">Select Product</option>
                        {products.length > 0 ? (
                            products.map(productItem => (
                                <option key={productItem._id} value={productItem._id}>
                                    {productItem.name}
                                </option>
                            ))
                        ) : (
                            <option value="">No products available</option>
                        )}
                    </select>

                    <input
                        type="number"
                        placeholder="Quantity in Stock"
                        value={quantityInStock}
                        onChange={(e) => setQuantityInStock(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

                    <input
                        type="number"
                        placeholder="Quantity Out of Stock"
                        value={quantityOutStock}
                        onChange={(e) => setQuantityOutStock(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

<div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
    <button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold transition"
    >
        Add Inventory
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

                <div className="mt-6 text-center text-sm text-gray-500">
                    Inventory Added On: {formatDate(date)}
                </div>
            </div>
        </div>
    );
};

export default AddInventoryForm;
