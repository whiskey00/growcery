import React from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Link } from '@inertiajs/react';
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
                backgroundColor: 'rgba(22, 163, 74, 0.6)',
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
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="px-2 sm:px-0">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Overview of your store's performance
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                    {/* Total Sales */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Total Sales</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">₱{Number(totalSales).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Total Orders</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{totalOrders}</p>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <Link href="/vendor/orders" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">View all orders →</Link>
                        </div>
                    </div>

                    {/* Best Selling */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 mb-3 sm:mb-0">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div className="sm:ml-4">
                                <h2 className="text-gray-500 text-xs sm:text-sm font-medium">Best Seller</h2>
                                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{bestSelling}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">Quick Actions</h3>
                        <div className="space-y-2 sm:space-y-3">
                            <Link href="/vendor/products/create" className="flex items-center text-xs sm:text-sm text-green-600 hover:text-green-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add New Product
                            </Link>
                            <Link href="/vendor/orders" className="flex items-center text-xs sm:text-sm text-green-600 hover:text-green-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                View Orders
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {/* Top Selling Products */}
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
                        <div className="h-[250px] sm:h-[300px]">
                            <Doughnut 
                                data={pieData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 12,
                                                padding: 15,
                                                font: {
                                                    size: window.innerWidth < 640 ? 10 : 12
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Monthly Earnings */}
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Monthly Earnings</h2>
                        <div className="h-[250px] sm:h-[300px]">
                            <Bar 
                                data={barData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { 
                                        legend: { 
                                            display: false 
                                        } 
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                font: {
                                                    size: window.innerWidth < 640 ? 10 : 12
                                                }
                                            }
                                        },
                                        x: {
                                            ticks: {
                                                font: {
                                                    size: window.innerWidth < 640 ? 10 : 12
                                                }
                                            }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 sm:p-6 border-b">
                        <div className="flex justify-between items-center">
                            <h2 className="text-base sm:text-lg font-medium text-gray-900">Recent Orders</h2>
                            <Link href="/vendor/orders" className="text-xs sm:text-sm text-green-600 hover:text-green-700">
                                View all
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                                                        {order.products[0]?.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                    <div className="text-xs sm:text-sm text-gray-900">₱{Number(order.total_price).toLocaleString()}</div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        order.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-3 sm:px-6 py-2 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
                                                No recent orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}