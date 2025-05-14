import React from 'react';
import { useForm } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';

export default function Edit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        quantity: product.quantity || '',
        description: product.description || '',
        status: product.status || 'draft',
        options: Array.isArray(product.options) ? product.options : [{ label: '', price: '' }],
    });

    const addOption = () => {
        setData('options', [...data.options, { label: '', price: '' }]);
    };

    const removeOption = (index) => {
        const updated = [...data.options];
        updated.splice(index, 1);
        setData('options', updated);
    };

    const handleOptionChange = (index, field, value) => {
        const updated = [...data.options];
        updated[index][field] = value;
        setData('options', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/vendor/products/${product.id}`);
    };

    return (
        <VendorLayout>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            >
                                <option value="">Select a category</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Grains">Grains</option>
                                <option value="Root Crops">Root Crops</option>
                                <option value="Leafy Greens">Leafy Greens</option>
                            </select>
                        {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                className="w-full border rounded px-4 py-2"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                className="w-full border rounded px-4 py-2"
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border rounded px-4 py-2"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full border rounded px-4 py-2"
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        {data.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Label (e.g. 1kg)"
                                    className="w-1/2 border rounded px-3 py-2"
                                    value={option.label}
                                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="w-1/3 border rounded px-3 py-2"
                                    value={option.price}
                                    onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-red-600 text-sm font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addOption} className="text-blue-600 text-sm mt-1">+ Add Option</button>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </VendorLayout>
    );
}
