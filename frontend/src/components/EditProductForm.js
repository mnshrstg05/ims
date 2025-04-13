import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaImage, FaEdit } from 'react-icons/fa';

const EditProductForm = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        sku: '',
        price: '',
        quantity: '',
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (productId) {
            axios.get(`http://localhost:5000/products/${productId}`)
                .then((res) => {
                    setProduct(res.data);
                    setPreviewImage(res.data.image);
                })
                .catch((err) => console.error('Error fetching product:', err));
        }

        axios.get('http://localhost:5000/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in product) {
            formData.append(key, product[key]);
        }
        if (image) formData.append('image', image);

        try {
            const res = await axios.put(`http://localhost:5000/products/${productId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.status === 200) navigate('/products');
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-gray-300 shadow-xl rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-yellow-600 mb-8 flex items-center justify-center gap-2">
                    <FaEdit className="text-indigo-500" /> Edit Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { label: 'Product Name', type: 'text', key: 'name', placeholder: 'Enter product name' },
                        { label: 'SKU', type: 'text', key: 'sku', placeholder: 'e.g. SKU-001' },
                        { label: 'Price', type: 'number', key: 'price', placeholder: 'e.g. 99.99' },
                        { label: 'Quantity', type: 'number', key: 'quantity', placeholder: 'e.g. 20' },
                    ].map(({ label, type, key, placeholder }) => (
                        <div key={key}>
                            <label className="block  font-bold text-teal-700 mb-2">{label}</label>
                            <input
                                type={type}
                                value={product[key]}
                                placeholder={placeholder}
                                onChange={(e) => setProduct({ ...product, [key]: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                required
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block  font-bold text-teal-700 mb-1">Description</label>
                        <textarea
                            value={product.description}
                            placeholder="Product details..."
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block  font-bold text-teal-700 mb-1">Category</label>
                        <select
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block  font-bold text-teal-700 mb-1">Product Image</label>
                        <div className="flex items-center gap-3">
                            <FaImage className="text-indigo-500 text-xl" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-sm text-gray-600"
                            />
                        </div>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="mt-3 w-full max-h-40 object-contain border border-gray-200 rounded-md shadow-sm"
                            />
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
    <button
        type="submit"
        className="w-full sm:w-auto bg-indigo-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2 transition"
    >
        <FaSave /> Save Changes
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
            </div>
        </div>
    );
};

export default EditProductForm;
