import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';


export default function Edit({ category }) {
    const { data, setData, put, errors } = useForm({
        name: category.name
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
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" className="w-full border rounded p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                </form>
            </div>
        </AdminLayout>
    );
}