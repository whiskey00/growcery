import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Show({ order }) {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        {/* Back Button */}
        <div className="mb-4">
            <Link
            href="/admin/orders"
            className="inline-block mb-4 bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded"
            >
            ← Back to Orders
            </Link>
        </div>
        {/* Order Info */}
        <div className="mb-4">
          <p><span className="font-semibold">Order ID:</span> #{String(order.id).padStart(5, '0')}</p>
          <p><span className="font-semibold">Vendor:</span> {order.vendor?.name || 'N/A'}</p>
          <p><span className="font-semibold">Total Price:</span> ₱{order.total_price}</p>
          <p>
            <span className="font-semibold">Status:</span>{' '}
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              order.status === 'cancelled'
                ? 'bg-red-100 text-red-600'
                : order.status === 'completed'
                ? 'bg-green-100 text-green-600'
                : order.status === 'to_ship'
                ? 'bg-blue-100 text-blue-600'
                : order.status === 'to_receive'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}>
              {order.status.replace('_', ' ')}
            </span>
          </p>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded">
            <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">₱{product.price}</td>
                  <td className="px-4 py-2">{product.pivot.quantity}</td>
                  <td className="px-4 py-2">₱{(product.price * product.pivot.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-6 text-lg font-bold">
          Total: ₱{order.total_price}
        </div>
      </div>
    </AdminLayout>
  );
}
