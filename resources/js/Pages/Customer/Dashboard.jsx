import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth, recentOrders } = usePage().props;
    const user = auth?.user;

    const statusMap = {
    All: '',
    'To Pay': 'To Pay',
    'To Ship': 'to_ship',
    'To Receive': 'to_receive',
    Completed: 'completed',
    Cancelled: 'cancelled'
    };

    const getStatusLabel = (rawStatus) => {
        for (const [label, status] of Object.entries(statusMap)) {
            if (status === rawStatus) return label;
        }
    return rawStatus; // fallback if no match
    };


    return (
        <CustomerLayout>
            <div className="w-full px-6 py-8 bg-white shadow rounded">
                <h1 className="text-2xl font-bold text-green-700 mb-6">
                    Welcome back, {user?.name}!
                </h1>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Continue Shopping */}
                    <Link href="/products" className="bg-gray-50 border rounded p-5 hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 text-green-700 p-2 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13l-1.5 6M6 19a1 1 0 100 2 1 1 0 000-2zm12-1a1 1 0 110 2 1 1 0 010-2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold">Continue Shopping</p>
                                <p className="text-sm text-gray-500">Browse fresh produce and new items</p>
                            </div>
                        </div>
                    </Link>

                    {/* My Orders */}
                    <Link href="/customer/orders" className="bg-gray-50 border rounded p-5 hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 text-green-700 p-2 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m2 6H7a2 2 0 01-2-2V6a2 2 0 012-2h3.28a2 2 0 011.44.64l.56.56h4.72a2 2 0 012 2v10a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold">My Orders</p>
                                <p className="text-sm text-gray-500">View your recent and active orders</p>
                            </div>
                        </div>
                    </Link>

                    {/* View Profile */}
                    <Link href={route('customer.profile.view')} className="bg-gray-50 border rounded p-5 hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 text-green-700 p-2 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A13.937 13.937 0 0112 15c2.45 0 4.712.662 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold">View Profile</p>
                                <p className="text-sm text-gray-500">Check your personal information</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="mt-10 bg-gray-50 border rounded p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

                    {recentOrders.length === 0 ? (
                        <>
                            <p className="text-sm text-gray-600">You have no recent orders.</p>
                            <p className="text-xs text-gray-400 mt-1">Once you place an order, it will appear here.</p>
                        </>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map(order => (
                            <div key={order.id} className="bg-white border rounded p-4 shadow-sm">
                                <div className="flex justify-between items-center text-sm mb-2">
                                <span className="font-medium text-gray-700">Order #{order.id}</span>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                    {getStatusLabel(order.status)}
                                </span>
                                </div>
                                {order.products.map(product => (
                                <div key={product.id} className="flex items-center gap-3 mb-2">
                                    <img src={`/storage/${product.image}`} alt={product.name} className="w-12 h-12 rounded object-cover border" />
                                    <div className="text-sm text-gray-700">
                                    {product.name} ({product.pivot.quantity} pcs)
                                    </div>
                                </div>
                                ))}
                                <div className="text-right text-sm text-green-700 font-semibold">
                                Total: ₱{Number(order.total_price).toLocaleString()}
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
