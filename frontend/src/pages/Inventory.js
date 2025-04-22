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
      axios
        .get('https://ims-3cdk.onrender.com/inventory/all-inventory')
        .then((response) => setProducts(response.data))
        .catch((error) => {
          console.error('Error fetching inventory items:', error);
          setError('Error fetching inventory items. Please try again later.');
        })
        .finally(() => setLoading(false));
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadInventory);
    } else {
      loadInventory();
    }
  }, []);

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Inventory record?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://ims-3cdk.onrender.com/inventory/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-700">Stock Report</h1>
        <Link
          to="/inventory/add-product"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
        >
          + ADD INVENTORY
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {loading && <p className="text-gray-600">Loading...</p>}

      {/* ✅ Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="border px-2 py-2 text-xs">Sn No</th>
              <th className="border px-2 py-2 text-xs">Product Name</th>
              <th className="border px-2 py-2 text-xs">Image</th>
              <th className="border px-2 py-2 text-xs">InStock</th>
              <th className="border px-2 py-2 text-xs">Stock Out</th>
              <th className="border px-2 py-2 text-xs">Date</th>
              <th className="border px-2 py-2 text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
              >
                <td className="border px-2 py-2 text-xs text-center">{index + 1}</td>
                <td className="border px-2 py-2 text-xs text-center uppercase text-yellow-800 font-semibold">
                  {product.product?.name || 'N/A'}
                </td>
                <td className="border px-2 py-2 text-center">
                  {product.product?.image ? (
                    <img
                      src={product.product?.image}
                      alt={product.product?.name}
                      className="h-14 w-14 object-cover rounded mx-auto"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="border px-2 py-2 text-sm text-center">
                  {product.quantityInStock === 0 ? (
                    <span className="text-red-500 font-semibold">Out of Stock</span>
                  ) : (
                    product.quantityInStock
                  )}
                </td>
                <td className="border px-2 py-2 text-sm text-center">{product.quantityOutStock}</td>
                <td className="border px-2 py-2 text-xs text-center">
                  {product.lastRestockedDate
                    ? new Date(product.lastRestockedDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                    <Link
                      to={`/inventory/edit/${product._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
        {products.map((product, index) => (
          <div key={product._id} className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-yellow-700 uppercase">
                {product.product?.name || 'Unnamed Product'}
              </h2>
              <span className="text-xs text-gray-500">#{index + 1}</span>
            </div>
            {product.product?.image && (
              <img
                src={product.product.image}
                alt={product.product.name}
                className="h-24 w-24 object-cover rounded mb-2"
              />
            )}
            <p className="text-xs"><strong>In Stock:</strong> {product.quantityInStock || 0}</p>
            <p className="text-xs"><strong>Stock Out:</strong> {product.quantityOutStock || 0}</p>
            <p className="text-xs"><strong>Last Restocked:</strong> {product.lastRestockedDate
              ? new Date(product.lastRestockedDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A'}</p>
            <div className="flex gap-2 mt-3">
              <Link
                to={`/inventory/edit/${product._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded flex items-center gap-1"
              >
                <FaEdit /> Edit
              </Link>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
