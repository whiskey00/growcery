import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function BuyAgain() {
  const { order } = usePage().props;

  const handleBuyAgain = (productId) => {
    // Redirect to the individual product page
    window.location.href = `/customer/products/${productId}`;
  };

  if (!order || !order.products) {
    return (
      <CustomerLayout>
        <Head title="Buy Again" />
        <div className="max-w-4xl mx-auto px-6 py-8 bg-white shadow rounded">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <Head title={`Buy Again - Order #${order.id}`} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link
            href="/customer/orders"
            className="text-sm text-green-600 hover:text-green-700 hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Buy Again</h1>
            <p className="text-sm text-gray-600 mt-1">
              Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
            </p>
            {order.vendor && (
              <p className="text-sm text-gray-600 mt-1">
                Vendor: {order.vendor.full_name}
              </p>
            )}
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {order.products.map((product) => (
                <div key={`${order.id}-${product.id}-${product.pivot.option_label}`} className="flex gap-4 items-start border-b border-gray-200 pb-6 last:border-b-0">
                  <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Quantity: {product.pivot.quantity}</p>
                          <p>Option: {product.pivot.option_label}</p>
                          <p>Price: ₱{Number(product.pivot.option_price).toLocaleString()}</p>
                        </div>
                                                 <div className="mt-2">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             product.status === 'published' && product.stock_quantity > 0
                               ? 'bg-green-100 text-green-800'
                               : 'bg-red-100 text-red-800'
                           }`}>
                             {product.status === 'published' && product.stock_quantity > 0
                               ? `In Stock (${product.stock_quantity} available)`
                               : 'Out of Stock'
                             }
                           </span>
                         </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-700">
                          ₱{Number(product.pivot.option_price).toLocaleString()}
                        </div>
                                                 <button
                           onClick={() => handleBuyAgain(product.id)}
                           disabled={product.status !== 'published' || product.stock_quantity <= 0}
                           className={`mt-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                             product.status === 'published' && product.stock_quantity > 0
                               ? 'bg-orange-500 text-white hover:bg-orange-600'
                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           }`}
                         >
                           {product.status === 'published' && product.stock_quantity > 0
                             ? 'Buy Again'
                             : 'Unavailable'
                           }
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  Total: ₱{Number(order.total_price).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Click "Buy Again" on individual products to reorder them
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
