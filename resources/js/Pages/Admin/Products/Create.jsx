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
        options: "", // comma-separated string
        quantity: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.products.store"));
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Vendor */}
                    <div>
                        <label className="block font-medium">Vendor</label>
                        <select
                            value={data.vendor_id}
                            onChange={(e) => setData("vendor_id", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Vendor</option>
                            {vendors.map((vendor) => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>
                        {errors.vendor_id && <p className="text-red-500 text-sm">{errors.vendor_id}</p>}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block font-medium">Product Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block font-medium">Category</label>
                        <input
                            type="text"
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block font-medium">Price (₱)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block font-medium">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block font-medium">Quantity (in stock)</label>
                        <input
                            type="number"
                            value={data.quantity}
                            onChange={(e) => setData("quantity", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block font-medium">Options (e.g. 1kg, 2kg)</label>
                        <input
                            type="text"
                            value={data.options}
                            onChange={(e) => setData("options", e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Separate with commas"
                        />
                        {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        {processing ? "Saving..." : "Save Product"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
