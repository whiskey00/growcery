import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { auth, recentOrders, vendorApplication } = usePage().props;
    const { t } = useTranslation();
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
                return 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100';
            case 'approved':
                return 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100';
        }
    };

    return (
        <CustomerLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl p-8 mb-8 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                    </div>
                    
                    <div className="relative flex justify-between items-center">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold text-white">
                                {t('customer.dashboard.welcomeBack', { name: user?.name })}
                            </h1>
                            <p className="text-green-100 text-lg">{t('customer.dashboard.manageOrders')}</p>
                        </div>
                        {!isActingVendor && (
                            vendorApplication ? (
                                <Link
                                    href="/customer/vendor-application/status"
                                    className={`inline-flex items-center px-8 py-4 border-2 rounded-xl font-semibold text-sm uppercase tracking-wider transition duration-150 ease-in-out hover:shadow-lg transform hover:-translate-y-0.5 ${getVendorApplicationStatusColor(vendorApplication.status)}`}
                                >
                                    Application {vendorApplication.status.charAt(0).toUpperCase() + vendorApplication.status.slice(1)}
                                </Link>
                            ) : (
                                <Link
                                    href="/customer/vendor-application/create"
                                    className="inline-flex items-center px-8 py-4 bg-white text-green-700 border-2 border-white rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-green-50 hover:shadow-lg transform hover:-translate-y-0.5 transition duration-150 ease-in-out"
                                >
                                    {t('customer.dashboard.becomeAVendor')}
                                </Link>
                            )
                        )}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className={`grid gap-6 ${isActingVendor ? 'md:grid-cols-4' : 'md:grid-cols-3'} mb-8`}>
                    {/* Continue Shopping */}
                    <Link href="/products" className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-green-200 flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 text-green-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13l-1.5 6M6 19a1 1 0 100 2 1 1 0 000-2zm12-1a1 1 0 110 2 1 1 0 010-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl text-gray-800">{t('customer.dashboard.continueShopping')}</h3>
                                    <p className="text-gray-600">{t('customer.dashboard.browseFreshProduce')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 text-sm text-green-700 font-semibold group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                            {t('customer.dashboard.viewProducts')} →
                        </div>
                    </Link>

                    {/* My Orders */}
                    <Link href="/customer/orders" className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 text-blue-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl text-gray-800">{t('customer.dashboard.myOrders')}</h3>
                                    <p className="text-gray-600">{t('customer.dashboard.viewRecentOrders')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 text-sm text-blue-700 font-semibold group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                            {t('customer.dashboard.viewOrders')} →
                        </div>
                    </Link>

                    {/* View Profile */}
                    <Link href="/customer/profile" className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-purple-200 flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 text-purple-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.45 0 4.712.662 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl text-gray-800">{t('customer.dashboard.viewProfile')}</h3>
                                    <p className="text-gray-600">{t('customer.dashboard.checkPersonalInfo')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 text-sm text-purple-700 font-semibold group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                            {t('customer.dashboard.viewProfile')} →
                        </div>
                    </Link>

                    {/* Vendor Dashboard (only shown for vendors) */}
                    {isActingVendor && (
                        <Link href="/vendor/dashboard" className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-yellow-200 flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex items-center gap-4">
                                    <div className="bg-yellow-100 text-yellow-600 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-800">{t('customer.dashboard.vendorDashboard')}</h3>
                                        <p className="text-gray-600">{t('customer.dashboard.manageVendorAccount')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 text-sm text-yellow-700 font-semibold group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
                                {t('customer.dashboard.viewDashboard')} →
                            </div>
                        </Link>
                    )}
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">{t('customer.dashboard.recentOrders')}</h2>
                    </div>

                    <div className="p-6">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">{t('customer.dashboard.noRecentOrders')}</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    {t('customer.dashboard.onceYouPlaceOrder')}
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        {t('customer.dashboard.startShopping')}
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
