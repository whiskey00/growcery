import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import debounce from 'lodash/debounce';

export default function Index({ users = [] }) {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

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

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            debouncedSearch.cancel();
        };
    }, []);

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'vendor':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Users</h1>
                        <p className="mt-1 sm:mt-2 text-sm text-gray-700">
                            Manage user accounts and permissions
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link
                            href="/admin/users/create"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add User
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="w-full sm:max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">Search users</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={search}
                            onChange={handleSearch}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Search users"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {isMobileView ? (
                        // Mobile Card View
                        <div className="divide-y divide-gray-200">
                            {users.data && users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <div key={user.id} className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0">
                                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-base font-medium text-gray-600">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-3">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="text-sm text-green-600 hover:text-green-900"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete ${user.name}?`)) {
                                                        router.delete(`/admin/users/${user.id}`);
                                                    }
                                                }}
                                                className="text-sm text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No users found
                                </div>
                            )}
                        </div>
                    ) : (
                        // Desktop Table View
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data && users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Delete ${user.name}?`)) {
                                                                router.delete(`/admin/users/${user.id}`);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.links && (
                    <div className="flex justify-center gap-1 sm:gap-2">
                        {users.links.map((link, index) => (
                            <button
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                disabled={!link.url}
                                onClick={() => handlePageChange(link.url)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md ${
                                    link.active
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
