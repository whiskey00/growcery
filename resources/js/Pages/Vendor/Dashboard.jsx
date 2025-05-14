import React from 'react';
import VendorLayout from '@/Layouts/VendorLayout';

export default function Dashboard({ totalSales, totalOrders, bestSelling }) {
    return (
        <VendorLayout>
            <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gray-50 p-6 rounded border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h2>
                    <p className="text-2xl text-green-700 font-bold">₱{Number(totalSales).toLocaleString()}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h2>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded border">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Best-Selling Product</h2>
                    <p className="text-2xl font-bold">{bestSelling}</p>
                </div>
            </div>
        </VendorLayout>
    );
}
