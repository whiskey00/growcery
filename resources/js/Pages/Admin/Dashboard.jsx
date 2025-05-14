import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gray-50 p-6 rounded border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Users</h2>
                    <p className="text-sm text-gray-600">Manage all platform users including customers and vendors.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Products</h2>
                    <p className="text-sm text-gray-600">Oversee all listed products from vendors.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Orders</h2>
                    <p className="text-sm text-gray-600">View and manage placed orders across the platform.</p>
                </div>
            </div>
        </AdminLayout>
    );
}
