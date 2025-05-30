import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, usePage, router } from '@inertiajs/react';

export default function Orders() {
  const { orders, activeStatus } = usePage().props;

  const statusMap = {
    All: 'all',
    'To Pay': 'to_pay',
    'To Ship': 'to_ship',
    'To Receive': 'to_receive',
    Completed: 'completed',
    Cancelled: 'cancelled',
  };

  const tabs = Object.keys(statusMap);

  const changeTab = (tab) => {
    const status = statusMap[tab];
    router.get('/customer/orders', status === 'all' ? {} : { status });
  };

  const formatStatus = (status) => {
    // If it's already in display format (e.g., "To Pay"), return as is
    if (status.includes(' ')) return status;
    
    // Convert from database format (e.g., "to_pay") to display format
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-3">My Account</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/customer/profile" className="text-green-700 hover:underline">
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link href="/customer/orders" className="text-green-700 font-medium">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold text-green-700 mb-4">My Orders</h1>

          {/* Tabs */}
          <div className="flex gap-6 border-b mb-6 overflow-x-auto text-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => changeTab(tab)}
                className={`pb-2 border-b-2 transition ${
                  statusMap[tab] === activeStatus
                    ? 'border-green-600 text-green-700 font-medium'
                    : 'border-transparent text-gray-500 hover:text-green-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Order List */}
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-gray-500">You have no orders under this filter.</p>
            ) : (
              orders.data.map((order) => (
                <div key={order.id} className="bg-white border rounded shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <div className="font-medium text-gray-700">Order #{order.id}</div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  {order.products.map((product) => (
                    <div key={product.id} className="flex gap-4 items-center border-b pb-4 last:border-b-0">
                      <img
                        src={`/storage/${product.image}`}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          Qty: {product.pivot.quantity} • ₱{Number(product.pivot.option_price).toLocaleString()} • Option: {product.pivot.option_label}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-right">
                    <div className="text-sm mt-2">
                      Total: <span className="font-bold text-green-700">₱{Number(order.total_price).toLocaleString()}</span>
                    </div>
                    <div className="mt-3 flex gap-2 justify-end">
                    <Link
                        href={`/customer/orders/${order.id}`}
                        className="text-xs border px-3 py-1 rounded hover:bg-gray-100"
                    >
                        View Details
                    </Link>
                    <button className="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
                        Buy Again
                    </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination */}
            {orders.links && (
            <div className="mt-6 flex justify-center gap-2 flex-wrap text-sm">
                {orders.links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded border ${
                    link.active
                        ? 'bg-green-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                ))}
            </div>
            )}

        </main>
      </div>
    </CustomerLayout>
  );
}
