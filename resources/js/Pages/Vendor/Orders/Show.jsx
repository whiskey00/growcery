import React, { useState, useEffect } from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Show({ order }) {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const { data, setData, patch, processing } = useForm({
    status: order.status
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStatusChange = (e) => {
    setData('status', e.target.value);
  };

  const updateStatus = (e) => {
    e.preventDefault();
    patch(`/vendor/orders/${order.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'to_ship':
        return 'bg-blue-100 text-blue-600';
      case 'to_receive':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-yellow-100 text-yellow-600';
    }
  };

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Order #{String(order.id).padStart(5, '0')}
          </h1>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-3">Customer Info</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {order.user?.full_name || 'N/A'}</p>
              <p><span className="font-medium">Contact:</span> {order.user?.mobile_number || 'N/A'}</p>
              <p><span className="font-medium">Address:</span> {order.shipping_address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-3">Products</h2>
          {isMobileView ? (
            // Mobile Card View
            <div className="space-y-3">
              {order.products.map((product) => (
                <div key={product.id} className="bg-gray-50 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <span className="text-sm">₱{product.price}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Quantity: {product.pivot.quantity}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop Table View
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">₱{product.price}</td>
                      <td className="px-4 py-2">{product.pivot.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Total Price</h2>
            <p className="text-lg font-bold">₱{order.total_price}</p>
          </div>
        </div>

        <form onSubmit={updateStatus} className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <label className="block text-sm font-medium mb-2">Update Status</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                value={data.status}
                onChange={handleStatusChange}
                className="border p-2 rounded w-full sm:w-auto sm:min-w-[200px]"
              >
                <option value="to_pay">To Pay</option>
                <option value="to_ship">To Ship</option>
                <option value="to_receive">To Receive</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="submit"
                disabled={processing}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </form>

        <div>
          <Link
            href="/vendor/orders"
            className="inline-flex items-center text-green-600 hover:text-green-700 text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
        </div>
      </div>
    </VendorLayout>
  );
}
