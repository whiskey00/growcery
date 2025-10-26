import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';


export default function Edit({ category }) {
    const { data, setData, put, errors } = useForm({
        name: category.name,
        name_tagalog: category.name_tagalog || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">English Name *</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g., Fruits, Vegetables"
                            required
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagalog Name (Optional)</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            value={data.name_tagalog} 
                            onChange={e => setData('name_tagalog', e.target.value)}
                            placeholder="e.g., Prutas, Gulay"
                        />
                        {errors.name_tagalog && <div className="text-red-600 text-sm mt-1">{errors.name_tagalog}</div>}
                        <p className="text-xs text-gray-500 mt-1">Leave empty if you don't have a Tagalog translation</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Update Category
                        </button>
                        <button 
                            type="button" 
                            onClick={() => router.visit('/admin/categories')}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}