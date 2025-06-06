import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from "@/Layouts/CustomerLayout";
import useCart from "@/Stores/useCart";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from 'react-i18next';

export default function Index({ cartItems }) {
  const { updateQuantity, removeFromCart, isLoading } = useCart();
  const { t } = useTranslation();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.selectedOption.price * item.quantity);
    }, 0);
  };

  return (
    <CustomerLayout>
      <Head title="Shopping Cart" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('cart.title')}</h1>
          <p className="text-green-100">{t('cart.subtitle')}</p>
        </div>

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
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('cart.empty')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('cart.emptyMessage')}</p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedOption.label}`} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={`/storage/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {t('cart.option')}: {item.selectedOption.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('cart.price')}: ₱{item.selectedOption.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedOption.label)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">{t('cart.orderSummary')}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                    <span className="font-medium text-gray-900">₱{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('cart.shippingFee')}</span>
                    <span className="font-medium text-gray-900">₱0.00</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">{t('cart.total')}</span>
                      <span className="text-xl font-semibold text-green-600">₱{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <Link
                    href="/customer/checkout"
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    {t('cart.proceedToCheckout')}
                  </Link>
                  <Link
                    href="/products"
                    className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {t('cart.continueShopping')}
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
