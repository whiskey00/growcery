import { Head, Link } from '@inertiajs/react';
import CustomerLayout from "@/Layouts/CustomerLayout";
import useCart from "@/Stores/useCart";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Index({ cartItems }) {
  const { updateQuantity, removeFromCart, isLoading } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.selectedOption.price * item.quantity);
    }, 0);
  };

  return (
    <CustomerLayout>
      <Head title="Shopping Cart" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart.</p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.selectedOption.label}`} className="p-4 sm:p-6">
                    <div className="flex items-center sm:items-start">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`/storage/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="flex-1 ml-6">
                        <div className="sm:flex sm:justify-between sm:items-start">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              <Link href={`/customer/products/${item.product_id}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Option: {item.selectedOption.label}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Price: ₱{item.selectedOption.price}
                            </p>
                            {item.vendor && (
                              <p className="mt-1 text-sm text-gray-500">
                                Sold by: {item.vendor.full_name}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 sm:mt-0 sm:ml-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  disabled={isLoading}
                                  className="p-1 rounded-md hover:bg-gray-100"
                                >
                                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="text-gray-900">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={isLoading}
                                  className="p-1 rounded-md hover:bg-gray-100"
                                >
                                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                disabled={isLoading}
                                className="text-sm font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-medium text-gray-900">Total</div>
                    <div className="text-base font-medium text-gray-900">₱{calculateTotal().toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/customer/checkout"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
