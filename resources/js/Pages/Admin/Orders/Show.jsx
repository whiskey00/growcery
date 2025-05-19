import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Show({ order }) {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">
          Order #{String(order.id).padStart(5, '0')}
        </h1>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Customer Info:</h2>
          <p><strong>Name:</strong> {order.user?.full_name || 'N/A'}</p>
          <p><strong>Contact:</strong> {order.user?.mobile_number || 'N/A'}</p>
          <p><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Vendor:</h2>
          <p>{order.vendor?.name || 'N/A'}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Products:</h2>
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

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Order Status:</h2>
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
        </div>

        <div className="text-right mt-6 text-lg font-bold">
          Total: ₱{order.total_price}
        </div>

        <div className="mt-6">
          <Link href="/admin/orders" className="text-blue-600 hover:underline text-sm">
            ← Back to Orders
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
