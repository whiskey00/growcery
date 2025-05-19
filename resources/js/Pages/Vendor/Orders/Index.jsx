import React from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ orders, activeStatus }) {
  const statuses = ['all', 'to_pay', 'to_ship', 'to_receive', 'completed', 'cancelled'];

  const handlePageChange = (url) => {
    if (url) window.location.href = url;
  };

  const handleFilterChange = (status) => {
    const query = status === 'all' ? {} : { status };
    router.get('/vendor/orders', query, { preserveState: true });
  };

  return (
    <VendorLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-3 py-1 text-sm rounded border ${
              activeStatus === status || (status === 'all' && !activeStatus)
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.data.length > 0 ? (
              orders.data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">#{String(order.id).padStart(5, '0')}</td>
                  <td className="px-6 py-3">{order.customer_name || 'N/A'}</td>
                  <td className="px-6 py-3">₱{order.total_price}</td>
                  <td className="px-6 py-3 capitalize">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      order.status === 'cancelled'
                        ? 'bg-red-100 text-red-600'
                        : order.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/vendor/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {orders.links && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          {orders.links.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              onClick={() => handlePageChange(link.url)}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`px-4 py-2 border rounded ${
                link.active
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            />
          ))}
        </div>
      )}
    </VendorLayout>
  );
}
