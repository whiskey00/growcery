import React, { useState } from "react";
import { usePage, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import useCart from '@/Stores/useCart';
import { useTranslation } from 'react-i18next';

export default function ProductBrowse({ products, categories, activeSearch, activeCategory }) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { addToCart } = useCart();
    const { t } = useTranslation();

    const handleSearch = (e) => {
        router.get('/products', { search: e.target.value, category: activeCategory }, { preserveState: true });
    };

    const handleCategoryClick = (category) => {
        router.get('/products', { search: activeSearch, category }, { preserveState: true });
        setShowMobileFilters(false);
    };

    const handleAddToCart = (product) => {
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
        alert(t('product.addedToCart', { name: product.name }));
    };

    return (
        <CustomerLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Filter Button */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="w-full flex items-center justify-center gap-2 bg-white border rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        {showMobileFilters ? t('common.hideFilters') : t('common.showFilters')}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="font-bold text-lg mb-4">{t('product.categories')}</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryClick('')}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${!activeCategory ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                                >
                                    {t('product.allCategories')}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${activeCategory === cat ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Header */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-xl font-bold text-gray-900">{t('product.allProducts')}</h1>
                                <div className="relative flex-1 sm:max-w-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t('product.searchPlaceholder')}
                                        defaultValue={activeSearch}
                                        onChange={handleSearch}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(activeSearch || activeCategory) && (
                                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                    <span>{t('common.filters')}:</span>
                                    {activeSearch && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {t('product.searchFilter')}: {activeSearch}
                                        </span>
                                    )}
                                    {activeCategory && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {t('product.categoryFilter')}: {activeCategory}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {products.data.map(product => (
                                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                                    <div className="relative pb-[75%]">
                                        <img
                                            src={product.image ? `/storage/${product.image}` : 'https://placehold.co/300x200?text=No+Image'} 
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h2>
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-xs sm:text-sm text-gray-500">{product.category?.name}</p>
                                            {product.vendor && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <Link
                                                        href={route('customer.vendors.show', { vendor: product.vendor.id })}
                                                        className="text-xs sm:text-sm text-green-600 hover:text-green-700"
                                                    >
                                                        {product.vendor.full_name}
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-green-600 font-bold text-sm sm:text-base mb-3">₱{Number(product.price).toLocaleString()}</p>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/customer/products/${product.id}`}
                                                className="w-full flex items-center justify-center text-white bg-green-600 py-2 rounded-md hover:bg-green-700 text-sm transition-colors duration-200"
                                            >
                                                {t('product.viewDetails')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.links?.length > 3 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {products.links.map((link, i) => (
                                    <button
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        disabled={!link.url}
                                        onClick={() => router.get(link.url)}
                                        className={`px-3 py-2 border rounded-md text-sm ${
                                            link.active
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
