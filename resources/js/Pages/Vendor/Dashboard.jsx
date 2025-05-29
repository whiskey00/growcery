import React from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard({ totalSales, totalOrders, bestSelling, monthlyEarnings, topSelling, recentOrders }) {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const earningsData = monthLabels.map((_, i) => monthlyEarnings[i + 1] || 0);

    const barData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Earnings (₱)',
                data: earningsData,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderRadius: 6,
            },
        ],
    };

    const pieData = {
        labels: topSelling.map(p => p.name),
        datasets: [
            {
                data: topSelling.map(p => p.orders),
                backgroundColor: ['#f87171', '#facc15', '#60a5fa', '#34d399', '#a78bfa'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <VendorLayout>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Dashboard Overview
            </h2>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
                <div className="bg-white shadow rounded p-6 text-center">
                    <h2 className="text-sm text-gray-500">Sales</h2>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="bg-white shadow rounded p-6 text-center">
                    <h2 className="text-sm text-gray-500">Best Seller</h2>
                    <p className="text-2xl font-bold">{bestSelling}</p>
                </div>
                <div className="bg-white shadow rounded p-6 text-center">
                    <h2 className="text-sm text-gray-500">Earnings</h2>
                    <p className="text-2xl font-bold">₱{Number(totalSales).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-md font-semibold mb-4">Top Selling Products</h2>
                    <Doughnut data={pieData} />
                </div>

                <div className="bg-white shadow rounded p-6">
                    <h2 className="text-md font-semibold mb-4">Monthly Earnings</h2>
                    <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            </div>

            <div className="bg-white shadow rounded p-6 mt-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-md font-semibold">Recent Orders</h2>
                    <button className="text-blue-600 text-sm">View All</button>
                </div>
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                        <tr>
                            <th className="py-2">Name</th>
                            <th>Price</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="py-2">{order.products[0]?.name || 'N/A'}</td>
                                <td>₱{order.total_price}</td>
                                <td>Paid</td>
                                <td>
                                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">
                                        Delivered
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {recentOrders.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-400 py-4">
                                    No recent orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </VendorLayout>
    );
}