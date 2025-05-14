import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { Link } from "@inertiajs/react";


export default function ProductIndex({ products = [] }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        // Implement server-side or local filtering later
    };

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <Link
                        href="/admin/products/create"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add Product
                    </Link>
                </div>                

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search products..."
                    className="p-2 border rounded w-full max-w-sm mb-6"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow border">
                        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Vendor</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-200">
                            {products.data && products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">{product.name}</td>
                                        <td className="px-6 py-3">{product.category}</td>
                                        <td className="px-6 py-3">₱{product.price}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                product.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">{product.vendor?.name || 'N/A'}</td>
                                        <td className="px-6 py-3 space-x-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products.links && (
                    <div className="flex justify-center mt-6 flex-wrap gap-2">
                        {products.links.map((link, index) => (
                            <button
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                disabled={!link.url}
                                onClick={() => handlePageChange(link.url)}
                                className={`px-4 py-2 border rounded ${
                                    link.active ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
