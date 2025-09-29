import React, { useState, useRef, useEffect } from "react";
import { usePage, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import useCart from '@/Stores/useCart';
import { useTranslation } from 'react-i18next';

export default function ProductBrowse({ products, categories, activeSearch, activeCategory, bestSellers = [] }) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { addToCart } = useCart();
    const { t } = useTranslation();
    const slideRef = useRef(null);

    // Slideshow configuration - responsive items per slide
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const itemsPerSlide = windowWidth < 768 ? 1 : 3; // 1 item on mobile, 3 on desktop
    const totalSlides = Math.ceil(bestSellers.length / itemsPerSlide);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setCurrentSlide(0); // Reset slide when window resizes
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (bestSellers.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }, 4000); // Auto-advance every 4 seconds

            return () => clearInterval(interval);
        }
    }, [bestSellers.length, totalSlides]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

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

    const renderStars = (rating) => {
        // Ensure rating is a valid number between 0 and 5
        const validRating = Math.max(0, Math.min(5, parseFloat(rating) || 0));
        const stars = [];
        const fullStars = Math.floor(validRating);
        const hasHalfStar = validRating % 1 !== 0;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${Math.round(validRating * 10)}`}>
                                <stop offset="50%" stopColor="currentColor"/>
                                <stop offset="50%" stopColor="transparent"/>
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${Math.round(validRating * 10)})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-3 h-3 text-gray-300" viewBox="0 0 20 20">
                        <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <CustomerLayout>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* Mobile Filter Button */}
                <div className="md:hidden mb-3">
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="w-full flex items-center justify-center gap-2 bg-white border rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        {showMobileFilters ? 'Hide Categories & Best Sellers' : 'Show Categories & Best Sellers'}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                    {/* Sticky Sidebar */}
                    <aside className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
                        <div className="md:sticky md:top-4 space-y-4">
                            {/* Categories */}
                            <div className="bg-white rounded-lg shadow-sm p-3.5">
                                <h2 className="font-semibold text-base mb-3">{t('product.categories')}</h2>
                                <div className="space-y-1.5">
                                    <button
                                        onClick={() => handleCategoryClick('')}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${!activeCategory ? 'bg-green-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        {t('product.allCategories')}
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${activeCategory === cat ? 'bg-green-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Best Sellers Slideshow */}
                            {bestSellers.length > 0 && !activeSearch && !activeCategory && (
                                <div className="bg-white rounded-lg shadow-sm p-3.5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                            <h2 className="text-sm font-semibold text-gray-900">Top Sellers</h2>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-yellow-50 px-1.5 py-0.5 rounded-full">Hot</span>
                                    </div>
                                    
                                    {/* Slideshow Container */}
                                    <div className="relative">
                                        <div className="overflow-hidden rounded-lg">
                                            <div 
                                                ref={slideRef}
                                                className="flex transition-transform duration-500 ease-in-out"
                                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                            >
                                                {Array.from({ length: totalSlides }, (_, slideIndex) => (
                                                    <div key={slideIndex} className="w-full flex-shrink-0 space-y-2">
                                                        {bestSellers
                                                            .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                                                            .map((product, index) => {
                                                                const globalIndex = slideIndex * itemsPerSlide + index;
                                                                const isOutOfStock = product.quantity === 0;
                                                                
                                                                return (
                                                                    <div key={product.id} className="relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 border border-yellow-200 hover:shadow-md transition-shadow">
                                                                        <div className="flex items-center gap-2">
                                                                            {/* Rank Badge */}
                                                                            <div className="flex-shrink-0">
                                                                                <span className="bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                                                                    #{globalIndex + 1}
                                                                                </span>
                                                                            </div>
                                                                            
                                                                            {/* Product Image */}
                                                                            <div className="w-12 h-12 flex-shrink-0">
                                                                                <img
                                                                                    src={product.image ? `/storage/${product.image}` : 'https://placehold.co/100x100?text=No+Image'} 
                                                                                    alt={product.name}
                                                                                    className={`w-full h-full object-cover rounded ${isOutOfStock ? 'grayscale' : ''}`}
                                                                                />
                                                                            </div>
                                                                            
                                                                            {/* Product Info */}
                                                                            <div className="flex-1 min-w-0">
                                                                                <h3 className="text-xs font-medium text-gray-900 truncate">{product.name}</h3>
                                                                                <p className="text-xs text-green-600 font-semibold">₱{Number(product.price).toLocaleString()}</p>
                                                                                <p className="text-xs text-yellow-600">{product.orders_count || 0} sold</p>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        {/* View Button */}
                                                                        <Link
                                                                            href={`/customer/products/${product.id}`}
                                                                            className={`w-full mt-1.5 flex items-center justify-center py-1 px-2 rounded text-xs font-medium transition-colors ${
                                                                                isOutOfStock 
                                                                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                                                                    : 'text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                                                                            }`}
                                                                        >
                                                                            {isOutOfStock ? 'Out of Stock' : 'View'}
                                                                        </Link>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Navigation Arrows */}
                                        {totalSlides > 1 && (
                                            <>
                                                <button
                                                    onClick={prevSlide}
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 bg-white shadow-lg rounded-full p-1 hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={nextSlide}
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 bg-white shadow-lg rounded-full p-1 hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                        
                                        {/* Slide Indicators */}
                                        {totalSlides > 1 && (
                                            <div className="flex justify-center gap-1 mt-2">
                                                {Array.from({ length: totalSlides }, (_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => goToSlide(i)}
                                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                                            currentSlide === i ? 'bg-yellow-500' : 'bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Header */}
                        <div className="bg-white rounded-lg shadow-sm p-3.5 mb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <h1 className="text-lg font-semibold text-gray-900">{t('product.allProducts')}</h1>
                                <div className="relative flex-1 sm:max-w-xs">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t('product.searchPlaceholder')}
                                        defaultValue={activeSearch}
                                        onChange={handleSearch}
                                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(activeSearch || activeCategory) && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium">{t('common.filters')}:</span>
                                    {activeSearch && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {t('product.searchFilter')}: {activeSearch}
                                        </span>
                                    )}
                                    {activeCategory && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {t('product.categoryFilter')}: {activeCategory}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Best Sellers moved to sidebar */}

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {products.data.map(product => {
                                const isOutOfStock = product.quantity === 0;
                                const rating = parseFloat(product.average_rating) || 0;
                                
                                return (
                                    <div key={product.id} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border ${isOutOfStock ? 'border-gray-200 opacity-75' : 'border-transparent hover:border-green-200'}`}>
                                        <div className="relative pb-[75%]">
                                            <img
                                                src={product.image ? `/storage/${product.image}` : 'https://placehold.co/300x200?text=No+Image'} 
                                                alt={product.name}
                                                className={`absolute inset-0 w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                                            />
                                            {isOutOfStock && (
                                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                            {!isOutOfStock && product.quantity <= 5 && (
                                                <div className="absolute top-2 left-2">
                                                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        Low Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h2 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1.5">{product.name}</h2>
                                            
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-1.5">
                                                <div className="flex items-center gap-0.5">
                                                    {renderStars(rating)}
                                                </div>
                                                <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1.5 mb-2 text-xs">
                                                <p className="text-gray-500">{product.category?.name}</p>
                                                {product.vendor && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <Link
                                                            href={route('customer.vendors.show', { vendor: product.vendor.id })}
                                                            className="text-green-600 hover:text-green-700 hover:underline truncate"
                                                        >
                                                            {product.vendor.full_name}
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-green-600 font-semibold text-sm sm:text-base">₱{Number(product.price).toLocaleString()}</p>
                                                {!isOutOfStock && (
                                                    <p className="text-xs text-gray-500">{product.quantity} left</p>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/customer/products/${product.id}`}
                                                    className={`w-full flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                        isOutOfStock 
                                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                                            : 'text-white bg-green-600 hover:bg-green-700'
                                                    }`}
                                                >
                                                    {isOutOfStock ? 'Out of Stock' : t('product.viewDetails')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {products.links?.length > 3 && (
                            <div className="mt-6 flex justify-center gap-1">
                                {products.links.map((link, i) => (
                                    <button
                                        key={i}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        disabled={!link.url}
                                        onClick={() => router.get(link.url)}
                                        className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
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
