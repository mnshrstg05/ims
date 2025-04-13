import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTags, FaEdit, FaTrash, FaSave } from 'react-icons/fa';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // ✅ Replace with real login logic

    // Handle mobile screen detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch categories from server
    useEffect(() => {
        axios.get('https://ims-3cdk.onrender.com/categories/all-category')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleDeleteCategory = (categoryId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (!confirmDelete) return;

        axios.delete(`https://ims-3cdk.onrender.com/categories/${categoryId}`)
            .then(() => {
                setCategories(categories.filter(category => category._id !== categoryId));
                alert("Category deleted successfully!");
            })
            .catch(error => console.error('Error deleting category:', error));
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '') {
            axios.post('https://ims-3cdk.onrender.com/categories', { name: newCategoryName })
                .then(response => {
                    setCategories([...categories, response.data]);
                    setNewCategoryName('');
                })
                .catch(error => console.error('Error adding category:', error));
        }
    };

    const handleEditClick = (category) => {
        setEditingCategoryId(category._id);
        setEditingCategoryName(category.name);
    };

    const handleEditSave = (categoryId) => {
        axios.put(`https://ims-3cdk.onrender.com/categories/${categoryId}`, { name: editingCategoryName })
            .then(response => {
                setCategories(categories.map(cat =>
                    cat._id === categoryId ? response.data : cat
                ));
                setEditingCategoryId(null);
                setEditingCategoryName('');
            })
            .catch(error => console.error('Error updating category:', error));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-teal-500 mb-4 md:mb-0">
                        <span className="text-4xl text-purple-500"><FaTags /></span> Categories
                    </h1>

                    {/* Show Add Category input only if: on desktop OR on mobile & logged in */}
                    {(!isMobile || (isMobile && isLoggedIn)) && (
                        <div className="flex items-center w-full md:w-auto space-x-2 overflow-hidden">
                            <input
                                type="text"
                                className="flex-1 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 rounded-md"
                                placeholder="New Category Name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <button
                                onClick={handleAddCategory}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
                            >
                                Add Category
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {categories.length > 0 ? (
                        categories.map(category => (
                            <div
                                key={category._id}
                                className="relative bg-gray-300 border p-4 text-gray-700 rounded shadow flex flex-col justify-between"
                                style={{ minHeight: "130px" }}
                            >
                                {editingCategoryId === category._id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                            className="border p-2 w-full mb-2"
                                        />
                                        <div className="flex justify-between mt-auto">
                                            <button
                                                onClick={() => handleEditSave(category._id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                                            >
                                                <FaSave className="mr-2" /> Save
                                            </button>
                                            <button
                                                onClick={() => setEditingCategoryId(null)}
                                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold mb-6">{category.name}</h3>
                                        <div className="absolute bottom-3 left-4">
                                            <button
                                                onClick={() => handleEditClick(category)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center text-sm shadow"
                                            >
                                                <FaEdit className="mr-2" /> Edit
                                            </button>
                                        </div>
                                        <div className="absolute bottom-3 right-4">
                                            <button
                                                onClick={() => handleDeleteCategory(category._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center text-sm shadow"
                                            >
                                                <FaTrash className="mr-2" /> Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No categories found. Start by adding one!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
