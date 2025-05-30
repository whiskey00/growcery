import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Index({ user, cartItems }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_address: user.shipping_address || '',
        mobile_number: user.mobile_number || '',
        payment_method: 'COD',
    });

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.selectedOption.price * item.quantity);
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customer/checkout');
    };

    return (
        <CustomerLayout>
            <Head title="Checkout" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Add some items to your cart before checking out.</p>
                        <div className="mt-6">
                            <a
                                href="/products"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <div className="space-y-6">
                            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={`${item.id}-${item.selectedOption.label}`} className="flex items-start">
                                                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Option: {item.selectedOption.label}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Price: ₱{item.selectedOption.price} × {item.quantity}
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        Subtotal: ₱{(item.selectedOption.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between">
                                            <span className="text-base font-medium text-gray-900">Total</span>
                                            <span className="text-base font-medium text-gray-900">
                                                ₱{calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Customer Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {user.full_name || user.name}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                                        Shipping Address
                                    </label>
                                    <div className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {user.shipping_address || 'No address provided'}
                                    </div>
                                    {!user.shipping_address && (
                                        <p className="mt-1 text-sm text-red-600">
                                            Please update your shipping address in your profile before checking out.
                                        </p>
                                    )}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700">
                                        Mobile Number
                                    </label>
                                    <div className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50">
                                        {user.mobile_number || 'No mobile number provided'}
                                    </div>
                                    {!user.mobile_number && (
                                        <p className="mt-1 text-sm text-red-600">
                                            Please update your mobile number in your profile before checking out.
                                        </p>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <div className="mt-2 space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                id="cod"
                                                name="payment_method"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                                                value="COD"
                                                checked={data.payment_method === 'COD'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                            />
                                            <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                                                Cash on Delivery (COD)
                                            </label>
                                        </div>
                                        <div className="flex items-center opacity-50">
                                            <input
                                                id="qrph"
                                                name="payment_method"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                                                value="QRPh"
                                                disabled
                                                checked={false}
                                            />
                                            <label htmlFor="qrph" className="ml-3 block text-sm font-medium text-gray-700">
                                                QR Ph (Coming Soon)
                                            </label>
                                        </div>
                                    </div>
                                    {errors.payment_method && (
                                        <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                                    )}
                                </div>

                                {errors.error && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">{errors.error}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing || !user.shipping_address || !user.mobile_number}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </button>
                                    {(!user.shipping_address || !user.mobile_number) && (
                                        <p className="mt-2 text-sm text-center text-red-600">
                                            Please update your profile with complete shipping address and mobile number to proceed.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
