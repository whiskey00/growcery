import React from 'react';
import { Link, router } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';

export default function Index({ products }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            router.delete(`/vendor/products/${id}`);
        }
    };

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    return (
        <VendorLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Products</h1>
                <Link
                    href="/vendor/products/create"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Product
                </Link>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-left font-semibold uppercase text-gray-600">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Qty</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.data && products.data.length > 0 ? (
                            products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3">{product.name}</td>
                                    <td className="px-6 py-3">{product.category?.name || '—'}</td>
                                    <td className="px-6 py-3">₱{product.price}</td>
                                    <td className="px-6 py-3">{product.quantity}</td>
                                    <td className="px-6 py-3 capitalize">{product.status}</td>
                                    <td className="px-6 py-3 text-right space-x-2">
                                        <Link
                                            href={`/vendor/products/${product.id}/edit`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No products found.
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
                            disabled={!link.url}
                            onClick={() => handlePageChange(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 border rounded ${
                                link.active
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        />
                    ))}
                </div>
            )}
        </VendorLayout>
    );
}
