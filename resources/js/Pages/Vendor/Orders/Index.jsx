import React, { useState, useEffect } from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';

export default function Index({ orders, activeStatus }) {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const statuses = ['all', 'to_pay', 'to_ship', 'to_receive', 'completed', 'cancelled'];

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

    const handleFilterChange = (status) => {
        const query = status === 'all' ? {} : { status };
        router.get('/vendor/orders', query, { preserveState: true });
    };

    // Create a debounced search function
    const debouncedSearch = debounce((query) => {
        setIsSearching(true);
        router.get('/vendor/orders', { search: query }, {
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

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'to_ship':
                return 'bg-blue-100 text-blue-800';
            case 'to_receive':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <VendorLayout>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Orders</h1>
                    <p className="mt-1 sm:mt-2 text-sm text-gray-700">
                        Manage and track your orders
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="w-full sm:max-w-lg lg:max-w-xs">
                        <label htmlFor="search" className="sr-only">Search orders</label>
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
                                placeholder="Search orders"
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

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => handleFilterChange(status)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md ${
                                    activeStatus === status || (status === 'all' && !activeStatus)
                                        ? 'bg-green-600 text-white border-transparent'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {isMobileView ? (
                        // Mobile Card View
                        <div className="divide-y divide-gray-200">
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => (
                                    <div key={order.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={`/storage/${order.products[0]?.image}`}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{String(order.id).padStart(5, '0')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                                {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <div className="text-sm font-medium text-gray-900">{order.user?.full_name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="text-sm font-medium text-gray-900">
                                                ₱{Number(order.total_price).toLocaleString()}
                                            </div>
                                            <Link
                                                href={`/vendor/orders/${order.id}`}
                                                className="text-sm text-green-600 hover:text-green-900"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No orders found
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
                                            Order Details
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                                src={`/storage/${order.products[0]?.image}`}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                #{String(order.id).padStart(5, '0')}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{order.user?.full_name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">₱{Number(order.total_price).toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/vendor/orders/${order.id}`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {orders.links && (
                    <div className="flex justify-center gap-1 sm:gap-2">
                        {orders.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => handlePageChange(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
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
        </VendorLayout>
    );
}
