import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function CategoryIndex({ categories = [] }) {
    const [search, setSearch] = useState("");
    const { flash } = usePage().props || {};

    const handleSearch = (e) => {
        setSearch(e.target.value);
        // Add server-side search support later
    };

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            router.delete(route("admin.categories.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Categories Management</h1>
                    <Link
                        href={route("admin.categories.create")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add Category
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
                        {flash.success}
                    </div>
                )}

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search categories..."
                    className="p-2 border rounded w-full max-w-sm mb-6"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow border">
                        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Slug</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-200">
                            {categories.data && categories.data.length > 0 ? (
                                categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">{category.name}</td>
                                        <td className="px-6 py-3">{category.slug}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                category.status
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                                {category.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 space-x-2">
                                            <Link
                                                href={route("admin.categories.edit", category.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {categories.links && (
                    <div className="flex justify-center mt-6 flex-wrap gap-2">
                        {categories.links.map((link, index) => (
                            <button
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                disabled={!link.url}
                                onClick={() => handlePageChange(link.url)}
                                className={`px-4 py-2 border rounded ${
                                    link.active ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
