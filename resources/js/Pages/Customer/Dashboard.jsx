import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth, recentOrders, vendorApplication } = usePage().props;
    const user = auth?.user;
    const isActingVendor = user?.role === 'vendor';

    const statusMap = {
        All: '',
        'To Pay': 'to_pay',
        'To Ship': 'to_ship',
        'To Receive': 'to_receive',
        Completed: 'completed',
        Cancelled: 'cancelled'
    };

    const getStatusLabel = (rawStatus) => {
        for (const [label, status] of Object.entries(statusMap)) {
            if (status === rawStatus) return label;
        }
        return rawStatus;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'to_pay':
                return 'bg-yellow-100 text-yellow-800';
            case 'to_ship':
                return 'bg-blue-100 text-blue-800';
            case 'to_receive':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getVendorApplicationStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <CustomerLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back, {user?.name}!
                            </h1>
                            <p className="text-green-100">Manage your orders and explore fresh products</p>
                        </div>
                        {!isActingVendor && (
                            vendorApplication ? (
                                <Link
                                    href="/customer/vendor-application/status"
                                    className={`inline-flex items-center px-6 py-3 border-2 rounded-lg font-semibold text-sm uppercase tracking-wider transition ${getVendorApplicationStatusColor(vendorApplication.status)}`}
                                >
                                    Application {vendorApplication.status.charAt(0).toUpperCase() + vendorApplication.status.slice(1)}
                                </Link>
                            ) : (
                                <Link
                                    href="/customer/vendor-application/create"
                                    className="inline-flex items-center px-6 py-3 bg-white text-green-700 border-2 border-white rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-green-50 transition duration-150 ease-in-out"
                                >
                                    Become a Vendor
                                </Link>
                            )
                        )}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className={`grid gap-6 ${isActingVendor ? 'md:grid-cols-4' : 'md:grid-cols-3'} mb-8`}>
                    {/* Continue Shopping */}
                    <Link href="/products" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 text-green-600 p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13l-1.5 6M6 19a1 1 0 100 2 1 1 0 000-2zm12-1a1 1 0 110 2 1 1 0 010-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">Continue Shopping</h3>
                                    <p className="text-gray-600">Browse fresh produce and new items</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 text-sm text-green-600 font-medium">
                            View Products →
                        </div>
                    </Link>

                    {/* My Orders */}
                    <Link href="/customer/orders" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">My Orders</h3>
                                    <p className="text-gray-600">View your recent and active orders</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 text-sm text-blue-600 font-medium">
                            View Orders →
                        </div>
                    </Link>

                    {/* View Profile */}
                    <Link href="/customer/profile" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.45 0 4.712.662 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">View Profile</h3>
                                    <p className="text-gray-600">Check your personal information</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 text-sm text-purple-600 font-medium">
                            View Profile →
                        </div>
                    </Link>

                    {/* Vendor Dashboard (only shown for vendors) */}
                    {isActingVendor && (
                        <Link href="/vendor/dashboard" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">Vendor Dashboard</h3>
                                        <p className="text-gray-600">Manage your vendor account</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 text-sm text-yellow-600 font-medium">
                                View Dashboard →
                            </div>
                        </Link>
                    )}
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                    </div>

                    <div className="p-6">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No Recent Orders</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Once you place an order, it will appear here.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        Order #{order.id}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-green-600">
                                                    ₱{Number(order.total_price).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {order.products.map((product, index) => (
                                                    <div key={`${order.id}-${product.id}-${index}`} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                                        <img 
                                                            src={`/storage/${product.image}`} 
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Qty: {product.pivot.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
