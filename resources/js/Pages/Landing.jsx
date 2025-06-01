import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';
import useCart from '@/Stores/useCart';
import { useTranslation } from 'react-i18next';

export default function Landing({ isLoggedIn, user, role, featuredProducts }) {
    const { addToCart } = useCart();
    const { t } = useTranslation();

    const handleAddToCart = (product) => {
        if (!isLoggedIn) {
            router.visit('/login');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            vendor_id: product.vendor_id,
            quantity: 1,
            selectedOption: {
                label: 'default',
                price: product.price
            }
        });

        alert(`${t('product.addedToCart', { name: product.name })}`);
    };

    return (
        <CustomerLayout>
            {/* Hero Section */}
            <div className="relative bg-green-50 py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
                            {t('common.welcome')}
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            {t('landing.heroText')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                            >
                                {t('landing.startShopping')}
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            {!isLoggedIn && (
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors duration-200"
                                >
                                    {t('common.register')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Decorative pattern */}
                <div className="absolute inset-x-0 bottom-0">
                    <div className="h-20 bg-gradient-to-b from-transparent to-white"></div>
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('landing.featuredProducts')}</h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">{t('landing.featuredProductsSubtext')}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <div className="relative pb-[75%]">
                                <img
                                    src={product.image ? `/storage/${product.image}` : "https://placehold.co/300x200?text=No+Image"}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mb-2">{product.category?.name}</p>
                                <p className="text-green-600 font-bold text-sm sm:text-base mb-3">₱{Number(product.price).toLocaleString()}</p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/customer/products/${product.id}`}
                                        className="flex-1 flex items-center justify-center text-white bg-green-600 py-2 rounded-md hover:bg-green-700 text-sm transition-colors duration-200"
                                    >
                                        {t('product.viewDetails')}
                                    </Link>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="p-2 bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center justify-center transition-colors duration-200"
                                        title={t('product.addToCart')}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-white"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.837l.383 1.436m0 0L6.75 14.25a1.125 1.125 0 001.09.855h9.21a1.125 1.125 0 001.09-.855l1.386-6.36a.75.75 0 00-.728-.885H6.272m-.166 0L5.25 5.25m0 0H3m3.75 13.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm10.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                    >
                        {t('landing.viewAllProducts')}
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}
