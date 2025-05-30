import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Show({ order }) {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Order #{String(order.id).padStart(5, '0')}
          </h1>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-3">Vendor Info</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {order.vendor?.name || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.vendor?.email || 'N/A'}</p>
              <p><span className="font-medium">Business:</span> {order.vendor?.business_name || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-3">Customer Info</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {order.user?.name || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
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
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Quantity: {product.pivot.quantity}</span>
                    <span>Subtotal: ₱{(product.price * product.pivot.quantity).toFixed(2)}</span>
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
                    <th className="px-4 py-2 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">₱{product.price}</td>
                      <td className="px-4 py-2">{product.pivot.quantity}</td>
                      <td className="px-4 py-2">
                        ₱{(product.price * product.pivot.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
          <Link href="/admin/orders" className="text-green-600 hover:text-green-700 text-sm order-2 sm:order-1 mt-4 sm:mt-0">
            ← Back to Orders
          </Link>
          <div className="text-lg font-bold order-1 sm:order-2">
            Total: ₱{order.total_price}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
