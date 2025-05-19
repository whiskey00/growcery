import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage, Link } from '@inertiajs/react';

export default function Show() {
  const { order } = usePage().props;

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Order #{order.id} Details</h1>

        <div className="mb-4">
          <span className="font-semibold text-sm text-gray-700">Status:</span>{' '}
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {formatStatus(order.status)}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-sm text-gray-800">Shipping Details</h2>
          <p className="text-sm text-gray-600">{order.shipping_address}</p>
          <p className="text-sm text-gray-600">Mobile: {order.mobile_number}</p>
          <p className="text-sm text-gray-600">Payment: {order.payment_method}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-sm text-gray-800">Products Ordered</h2>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div key={product.id} className="flex gap-4 items-center border-b pb-4 last:border-b-0">
                <img
                  src={`/storage/${product.image}`}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    Qty: {product.pivot.quantity} • ₱{Number(product.pivot.option_price).toLocaleString()} • Option: {product.pivot.option_label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm mt-2">
            Total Amount:{' '}
            <span className="font-bold text-green-700">
              ₱{Number(order.total_price).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href={route('customer.orders.index')}
            className="text-sm text-green-600 hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}
