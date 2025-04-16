import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use requestIdleCallback if available for smoother UX
        const loadData = () => {
            axios.get('https://ims-3cdk.onrender.com/products/all-products')
                .then(response => {
                    setProducts(response.data);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    setError('Error fetching products. Please try again later.');
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadData);
        } else {
            loadData();
        }
    }, []);

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`https://ims-3cdk.onrender.com/products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl text-teal-700 font-bold">Product Details</h1>
                <Link
                    to="/products/add-product"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Add Product
                </Link>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading
                    ? [...Array(6)].map((_, idx) => (
                          <div key={idx} className="animate-pulse bg-gray-200 h-40 rounded"></div>
                      ))
                    : products.length === 0
                    ? <p className="col-span-full">No products available.</p>
                    : products.map(product => (
                          <div key={product._id} className="transition-opacity duration-300 opacity-100">
                              <ProductCard product={product} onDelete={handleDeleteProduct} />
                          </div>
                      ))
                }
            </div>
        </div>
    );
};

export default ProductPage;
