import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ orders, activeStatus }) {
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
    };
  }, []);

  const handlePageChange = (url) => {
    if (url) window.location.href = url;
  };

  const handleFilterChange = (status) => {
    const query = status === 'all' ? {} : { status };
    router.get('/admin/orders', query, { preserveState: true });
  };

  const getStatusBadgeColor = (status) => {
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

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-700">
              Manage and track all customer orders
            </p>
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
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
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
                      <span className="text-sm font-medium text-gray-900">
                        #{String(order.id).padStart(5, '0')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {order.vendor?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{order.vendor?.name}</div>
                          <div className="text-xs text-gray-500">{order.vendor?.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Total</span>
                        <span className="text-sm font-medium text-gray-900">
                          ₱{Number(order.total_price).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">Date</span>
                        <span className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Link
                        href={`/admin/orders/${order.id}`}
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
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                          <span className="text-sm font-medium text-gray-900">
                            #{String(order.id).padStart(5, '0')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {order.vendor?.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{order.vendor?.name}</div>
                              <div className="text-sm text-gray-500">{order.vendor?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            ₱{Number(order.total_price).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
    </AdminLayout>
  );
}
