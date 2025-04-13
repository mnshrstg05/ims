import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setDate(new Date());

        axios.get('https://ims-3cdk.onrender.com/categories')
            .then(response => {
                console.log('Fetched categories:', response.data);

                // Adjust according to response shape
                const categoryData = Array.isArray(response.data)
                    ? response.data
                    : response.data.categories || [];

                setCategories(categoryData);
            })
            .catch(error => console.error('Error fetching categories:', error));
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

        if (!name || !sku || !price || !quantity || !category || !image) {
            alert('Please fill in all required fields');
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validImageTypes.includes(image.type)) {
            alert('Only image files are allowed (JPG, PNG, GIF)');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('sku', sku);
        formData.append('price', parseFloat(price));
        formData.append('quantity', parseInt(quantity, 10));
        formData.append('category', category);
        formData.append('image', image);
        formData.append('dateAdded', formatDate(date));

        try {
            const response = await axios.post('https://ims-3cdk.onrender.com/products/create-product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 201) {
                // Reset form
                setName('');
                setDescription('');
                setSku('');
                setPrice('');
                setQuantity('');
                setCategory('');
                setImage(null);
                navigate('/products');
            } else {
                alert('Error adding product: ' + response.statusText);
            }
        } catch (error) {
            if (error.response) {
                alert('Error adding product: ' + (error.response.data.message || error.response.statusText));
            } else if (error.request) {
                alert('No response from server.');
            } else {
                alert('Error: ' + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-gray-300 shadow-xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-yellow-600 mb-8">Add New Product</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />

                    <input
                        type="text"
                        placeholder="SKU"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.length === 0 && (
                            <option disabled>Loading categories...</option>
                        )}
                        {Array.isArray(categories) && categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 file:cursor-pointer file:border-none file:bg-green-100 file:text-green-800 file:rounded-md file:px-3 hover:file:bg-green-200 transition"
                        required
                    />

                    <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold transition"
                        >
                            Update Product
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md font-semibold transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Product AddOn: {formatDate(date)}
                </div>
            </div>
        </div>
    );
};

export default AddProductForm;
