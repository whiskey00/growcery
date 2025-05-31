import { useState, useEffect } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

export default function Index({ user, cartItems }) {
    const { csrf_token } = usePage().props;
    const isDirectCheckout = cartItems.length === 1 && cartItems[0].id === 'temp';
    const [qrData, setQrData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    
    // Set up axios CSRF token
    useEffect(() => {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;
    }, [csrf_token]);
    
    const { data, setData, post, processing, errors } = useForm({
        shipping_address: user.shipping_address || '',
        mobile_number: user.mobile_number || '',
        payment_method: 'COD',
        items: cartItems
    });

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.selectedOption.price * item.quantity);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (data.payment_method === 'QRPh') {
            try {
                const response = await axios.post(
                    isDirectCheckout ? '/customer/direct-checkout/complete' : '/customer/checkout',
                    data
                );
                
                if (response.data.success && response.data.order) {
                    await generateQR(response.data.order.id);
                }
            } catch (error) {
                console.error('Checkout failed:', error);
            }
        } else {
            // For COD, use the regular Inertia form submission
            post(isDirectCheckout ? '/customer/direct-checkout/complete' : '/customer/checkout');
        }
    };

    const generateQR = async (orderId) => {
        try {
            const response = await axios.post('/customer/qrph/generate', { order_id: orderId });
            if (response.data.success) {
                setQrData(response.data.data);
                // Start polling for payment status
                startPaymentSimulation(response.data.data.reference);
            }
        } catch (error) {
            console.error('Failed to generate QR:', error);
        }
    };

    const startPaymentSimulation = async (reference) => {
        // Simulate payment after 5 seconds
        setTimeout(async () => {
            try {
                const response = await axios.post('/customer/qrph/simulate-payment', { reference });
                if (response.data.success) {
                    setPaymentStatus('to_ship');
                    // Show success message before redirecting
                    alert('Payment successful! Your order will be shipped soon.');
                    // Redirect to orders page after successful payment
                    window.location.href = '/customer/orders';
                }
            } catch (error) {
                console.error('Payment simulation failed:', error);
            }
        }, 5000);
    };

    return (
        <CustomerLayout>
            <Head title="Checkout" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Checkout</h1>
                    <p className="text-green-100">Review your order and shipping information</p>
                </div>

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
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Content - Left Side */}
                        <div className="flex-1 space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                                <div className="border-b border-gray-200">
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {cartItems.map((item) => (
                                            <div key={`${item.id}-${item.selectedOption.label}`} className="flex flex-col sm:flex-row sm:items-start gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                                                <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
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
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-medium text-gray-900">Total Amount</span>
                                            <span className="text-xl font-semibold text-green-600">
                                                ₱{calculateTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                                <div className="border-b border-gray-200">
                                    <div className="flex justify-between items-center p-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 rounded-lg p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                                        </div>
                                        <Link
                                            href="/customer/profile/edit"
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <dl className="space-y-6">
                                        <div className="flex items-center">
                                            <dt className="flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </dt>
                                            <dd className="ml-3">
                                                <span className="block text-sm font-medium text-gray-500">Full Name</span>
                                                <span className="block mt-1 text-sm text-gray-900">{user.full_name}</span>
                                            </dd>
                                        </div>

                                        <div className="flex items-center">
                                            <dt className="flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </dt>
                                            <dd className="ml-3">
                                                <span className="block text-sm font-medium text-gray-500">Mobile Number</span>
                                                <span className="block mt-1 text-sm text-gray-900">{user.mobile_number || '—'}</span>
                                            </dd>
                                        </div>

                                        <div className="flex items-start">
                                            <dt className="flex-shrink-0 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </dt>
                                            <dd className="ml-3">
                                                <span className="block text-sm font-medium text-gray-500">Shipping Address</span>
                                                <span className="block mt-1 text-sm text-gray-900 whitespace-pre-wrap">{user.shipping_address || '—'}</span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section - Right Side */}
                        <div className="lg:w-96 space-y-6">
                            <div className="bg-white shadow-sm rounded-lg overflow-hidden sticky top-8">
                                <div className="border-b border-gray-200">
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {/* COD Option */}
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                id="cod"
                                                name="payment_method"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                                                value="COD"
                                                checked={data.payment_method === 'COD'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                                                <span className="block text-sm text-gray-500">Pay when you receive</span>
                                            </div>
                                        </label>

                                        {/* QR Ph Option */}
                                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                id="qrph"
                                                name="payment_method"
                                                type="radio"
                                                className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                                                value="QRPh"
                                                checked={data.payment_method === 'QRPh'}
                                                onChange={e => setData('payment_method', e.target.value)}
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-gray-900">QR Ph (Test Mode)</span>
                                                <span className="block text-sm text-gray-500">Pay via QR code</span>
                                            </div>
                                        </label>
                                    </div>

                                    {errors.payment_method && (
                                        <p className="mt-2 text-sm text-red-600">{errors.payment_method}</p>
                                    )}

                                    {/* QR Code Display */}
                                    {qrData && data.payment_method === 'QRPh' && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="text-center">
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code to Pay</h3>
                                                <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
                                                    <QRCodeSVG value={qrData.qr_string} size={200} />
                                                </div>
                                                <p className="mt-4 text-sm text-gray-500">
                                                    Reference: {qrData.reference}
                                                </p>
                                                {paymentStatus === 'pending' && (
                                                    <p className="mt-2 text-sm text-blue-600">
                                                        Simulating payment... Please wait 5 seconds.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {errors.error && (
                                        <div className="mt-4 rounded-md bg-red-50 p-4">
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
                                </div>

                                <div className="p-6 bg-gray-50 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-gray-500">Subtotal</span>
                                        <span className="font-medium text-gray-900">₱{calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-gray-500">Shipping Fee</span>
                                        <span className="font-medium text-gray-900">₱0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-medium text-gray-900">Total</span>
                                            <span className="text-xl font-semibold text-green-600">₱{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                        disabled={processing || paymentStatus !== 'pending'}
                                        onClick={handleSubmit}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
