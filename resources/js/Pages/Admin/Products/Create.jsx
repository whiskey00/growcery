import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

export default function Create({ vendors }) {
    const { data, setData, post, processing, errors } = useForm({
        vendor_id: "",
        name: "",
        category: "",
        price: "",
        status: "draft",
        description: "",
        options: "",
        quantity: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.products.store"));
    };

    const categoryOptions = [
        "Vegetables",
        "Fruits",
        "Grains",
        "Root Crops",
        "Leafy Greens",
    ];

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
                <h1 className="text-3xl font-bold mb-6 text-green-700">Add New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Vendor */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Vendor</label>
                        <select
                            value={data.vendor_id}
                            onChange={(e) => setData("vendor_id", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Vendor</option>
                            {vendors.map((vendor) => (
                                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                            ))}
                        </select>
                        {errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Product Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Category</label>
                        <select
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Price (₱)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Quantity (in stock)</label>
                        <input
                            type="number"
                            value={data.quantity}
                            onChange={(e) => setData("quantity", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Options (e.g. 1kg, 2kg)</label>
                        <input
                            type="text"
                            value={data.options}
                            onChange={(e) => setData("options", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Separate with commas"
                        />
                        {errors.options && <p className="text-red-500 text-sm mt-1">{errors.options}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        {processing ? "Saving..." : "Save Product"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}