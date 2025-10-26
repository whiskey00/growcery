import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';


export default function Create() {
    const [name, setName] = useState('');
    const [nameTagalog, setNameTagalog] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.categories.store'), { 
            name, 
            name_tagalog: nameTagalog 
        }, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">English Name *</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., Fruits, Vegetables"
                            required
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagalog Name (Optional)</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                            value={nameTagalog} 
                            onChange={e => setNameTagalog(e.target.value)}
                            placeholder="e.g., Prutas, Gulay"
                        />
                        {errors.name_tagalog && <div className="text-red-600 text-sm mt-1">{errors.name_tagalog}</div>}
                        <p className="text-xs text-gray-500 mt-1">Leave empty if you don't have a Tagalog translation</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            type="submit" 
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            Create Category
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