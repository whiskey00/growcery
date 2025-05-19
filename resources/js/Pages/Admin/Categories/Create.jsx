import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';


export default function Create() {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.categories.store'), { name }, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} />
                        {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                </form>
            </div>
        </AdminLayout>
    );
}