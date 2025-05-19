import React from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Show({ order }) {
  const { data, setData, patch, processing } = useForm({
    status: order.status
  });

  const handleStatusChange = (e) => {
    setData('status', e.target.value);
  };

  const updateStatus = (e) => {
    e.preventDefault();
    patch(`/vendor/orders/${order.id}`);
  };

  return (
    <VendorLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Order #{String(order.id).padStart(5, '0')}</h1>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Customer:</h2>
          <p>{order.customer_name || 'N/A'}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Products:</h2>
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

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Total Price:</h2>
          <p className="text-lg font-bold">₱{order.total_price}</p>
        </div>

        <form onSubmit={updateStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Update Status:</label>
            <select
              value={data.status}
              onChange={handleStatusChange}
              className="border p-2 rounded w-full max-w-sm"
            >
              <option value="to_pay">To Pay</option>
              <option value="to_ship">To Ship</option>
              <option value="to_receive">To Receive</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Update Status
          </button>
        </form>

        <div className="mt-6">
          <Link href="/vendor/orders" className="text-blue-600 hover:underline text-sm">
            ← Back to Orders
          </Link>
        </div>
      </div>
    </VendorLayout>
  );
}
