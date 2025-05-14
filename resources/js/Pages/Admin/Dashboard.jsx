import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Dashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`w-64 bg-gray-800 text-white p-5 md:w-1/4 lg:w-1/5 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
                <h2 className="text-2xl font-bold text-center mb-5">Admin Dashboard</h2>
                <ul>
                    <li className="mb-4">
                        <Link href="/admin" className="text-white hover:bg-gray-700 p-2 rounded block">Dashboard Overview</Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/users" className="text-white hover:bg-gray-700 p-2 rounded block">Users</Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/products" className="text-white hover:bg-gray-700 p-2 rounded block">Products</Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/orders" className="text-white hover:bg-gray-700 p-2 rounded block">Orders</Link>
                    </li>
                    <li className="mb-4">
                        <Link href="/admin/settings" className="text-white hover:bg-gray-700 p-2 rounded block">Settings</Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-y-auto">
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={toggleSidebar} className="md:hidden p-2 text-white bg-blue-500 rounded-md">
                        ☰
                    </button>
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">Logout</button>
                </div>

                {/* Container for Page Content */}
                <div className="container mx-auto">
                    {/* Inertia will handle the page rendering */}
                </div>
            </div>
        </div>
    );
}
