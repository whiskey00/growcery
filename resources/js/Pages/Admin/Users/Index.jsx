import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from 'react';

export default function Index({ users = [] }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        // You can implement search with debounce or server-side later
    };

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Users Management</h1>

                <input 
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search users..."
                    className="p-2 border rounded w-full max-w-sm mb-6"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow border">
                        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-200">
                            {users.data && users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">{user.name}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3 capitalize">{user.role}</td>
                                        <td className="px-6 py-3 space-x-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && (
                    <div className="flex justify-center mt-6 flex-wrap gap-2">
                        {users.links.map((link, index) => (
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
