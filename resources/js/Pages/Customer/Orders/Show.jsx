import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage, Link } from '@inertiajs/react';
import ReviewForm from '@/Components/ReviewForm';
import { Head } from '@inertiajs/react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function Show() {
  const { order } = usePage().props;
  console.log('Order data:', order);

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (!order || !order.products) {
    return (
      <CustomerLayout>
        <Head title="Order Details" />
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
      <Head title={`Order #${order.id}`} />

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
          {order.vendor && (
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="text-gray-600">Sold by:</span>
              <Link
                href={route('customer.vendors.show', { vendor: order.vendor.id })}
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                {order.vendor.full_name}
              </Link>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="space-y-4">
            {order.products.map((product) => (
              <div key={`order-product-${product.id}-${product.pivot.option_label}`} className="flex gap-4 items-center border-b pb-4 last:border-b-0">
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

        <div className="mt-4">
          <Link
            href={route('messages.new', { 
              receiver_id: order.vendor_id,
              order_id: order.id 
            })}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
            Message Vendor
          </Link>
        </div>

        {order.status === 'completed' && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Product Reviews
            </h2>
            <div className="bg-white rounded-lg shadow divide-y">
              {order.products.map((product) => (
                <div key={`review-product-${product.id}-${product.pivot.option_label}`} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16">
                      {product.image ? (
                        <img
                          src={`/storage/${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {product.pivot.quantity}
                      </p>
                    </div>
                  </div>

                  {!product.has_review ? (
                    <ReviewForm
                      productId={product.id}
                      orderId={order.id}
                    />
                  ) : (
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm text-gray-500">
                        You have already reviewed this product
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
