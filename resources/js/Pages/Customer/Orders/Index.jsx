import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';

export default function Orders() {
    const tabs = ['All', 'To Pay', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];
    const activeTab = 'All'; // You can wire this with query params later

    return (
        <CustomerLayout>
            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
                {/* Sidebar */}
                <aside className="w-64 hidden md:block">
                    <div className="bg-white shadow rounded p-4">
                        <h2 className="text-lg font-semibold mb-3">My Account</h2>
                        <ul className="text-sm space-y-2">
                            <li><Link href="/profile" className="text-green-700 hover:underline">Edit Profile</Link></li>
                            <li><Link href="/customer/orders" className="text-green-700 font-medium">My Orders</Link></li>
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <h1 className="text-2xl font-bold text-green-700 mb-4">My Orders</h1>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b mb-6 overflow-x-auto text-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`pb-2 border-b-2 ${
                                    tab === activeTab
                                        ? 'border-green-600 text-green-700 font-medium'
                                        : 'border-transparent text-gray-500 hover:text-green-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Order List */}
                    <div className="space-y-6">
                        <div className="bg-white border rounded shadow-sm p-6">
                            <div className="flex justify-between items-center text-sm mb-4">
                                <div className="font-medium text-gray-700">Order #00001</div>
                                <span className="text-red-500 font-semibold text-xs bg-red-100 px-2 py-1 rounded-full">Cancelled</span>
                            </div>

                            <div className="flex gap-4 items-center">
                                <img src="https://placehold.co/80x80" alt="Product" className="rounded border" />
                                <div className="flex-1">
                                    <div className="font-semibold">Tomatoes</div>
                                    <div className="text-xs text-gray-500">Qty: 1 • ₱80</div>
                                </div>
                                <div className="text-right text-sm">
                                    <div>Total: <span className="font-bold text-green-700">₱80</span></div>
                                    <div className="mt-3 flex gap-2 justify-end">
                                        <button className="text-xs border px-3 py-1 rounded hover:bg-gray-100">View Details</button>
                                        <button className="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">Buy Again</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* More sample orders can go here */}
                    </div>
                </main>
            </div>
        </CustomerLayout>
    );
}
