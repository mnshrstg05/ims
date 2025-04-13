import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline'; // Optional, if using Heroicons

const CategoryCard = ({ category, onDelete }) => {
    const handleDelete = () => {
        onDelete(category._id);
    };

    return (
        <div className="bg-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-lg p-5 flex flex-col justify-between h-full border border-gray-300">
            <div>
                <h2 className="text-lg font-semibold text-gray-600 mb-3">
                    📁 {category.name}
                </h2>
            </div>
            <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-all mt-auto"
            >
                <TrashIcon className="w-5 h-5" />
                Delete
            </button>
        </div>
    );
};

export default CategoryCard;
