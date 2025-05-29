import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import debounce from 'lodash/debounce';

export default function Index({ users = [] }) {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Create a debounced search function
    const debouncedSearch = debounce((query) => {
        setIsSearching(true);
        router.get('/admin/users', { search: query }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    }, 300);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearch(query);
        debouncedSearch(query);
    };

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    return (
        <AdminLayout>
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Users Management</h1>
                    <Link
                        href="/admin/users/create"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        + Add User
                    </Link>
                </div>

                <div className="relative">
                    <input 
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search users..."
                        className="p-2 border rounded w-full max-w-sm mb-6"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-2">
                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>

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
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete ${user.name}?`)) {
                                                        router.delete(`/admin/users/${user.id}`);
                                                    }
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
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
