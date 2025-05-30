import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({ stats = { users: 0, products: 0, orders: 0, pendingApplications: 0 } }) {
    return (
        <AdminLayout>
            <div className="space-y-4 sm:space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                    {/* Total Users */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Total Users</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.users}</p>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <Link href="/admin/users" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">View all users →</Link>
                        </div>
                    </div>

                    {/* Total Products */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Total Products</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.products}</p>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <Link href="/admin/products" className="text-xs sm:text-sm text-green-600 hover:text-green-800">View all products →</Link>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Total Orders</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.orders}</p>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <Link href="/admin/orders" className="text-xs sm:text-sm text-purple-600 hover:text-purple-800">View all orders →</Link>
                        </div>
                    </div>

                    {/* Pending Applications */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Pending Applications</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.pendingApplications}</p>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <Link href="/admin/vendor-applications" className="text-xs sm:text-sm text-yellow-600 hover:text-yellow-800">Review applications →</Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-4 sm:p-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/admin/users/create"
                            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">Add User</p>
                                <p className="text-xs text-gray-500">Create a new user account</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/products/create"
                            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                            <div className="p-2 rounded-full bg-green-100 text-green-600">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">Add Product</p>
                                <p className="text-xs text-gray-500">List a new product</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/categories/create"
                            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">Add Category</p>
                                <p className="text-xs text-gray-500">Create a new category</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                        >
                            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="ml-3 sm:ml-4">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">View Orders</p>
                                <p className="text-xs text-gray-500">Check recent orders</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
