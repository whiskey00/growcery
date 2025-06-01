import React, { useState, useEffect } from 'react';
import VendorLayout from '@/Layouts/VendorLayout';
import { Link, router } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Index({ reviews, stats, products, filters }) {
    const [selectedRating, setSelectedRating] = useState(filters.rating || '');
    const [selectedProduct, setSelectedProduct] = useState(filters.product || '');

    // Debounce timer
    const [filterTimer, setFilterTimer] = useState(null);

    const handleFilterChange = (type, value) => {
        if (type === 'rating') {
            setSelectedRating(value);
        } else if (type === 'product') {
            setSelectedProduct(value);
        }

        // Clear existing timer
        if (filterTimer) {
            clearTimeout(filterTimer);
        }

        // Set new timer
        const timer = setTimeout(() => {
            const newFilters = {};
            
            // Only add filters if they have values
            if (type === 'rating') {
                if (value) {
                    newFilters.rating = value;
                }
                if (selectedProduct) {
                    newFilters.product = selectedProduct;
                }
            } else if (type === 'product') {
                if (selectedRating) {
                    newFilters.rating = selectedRating;
                }
                if (value) {
                    newFilters.product = value;
                }
            }

            router.get('/vendor/reviews', newFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300); // 300ms delay

        setFilterTimer(timer);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (filterTimer) {
                clearTimeout(filterTimer);
            }
        };
    }, [filterTimer]);

    // Rating distribution chart data
    const ratingData = {
        labels: ['1★', '2★', '3★', '4★', '5★'],
        datasets: [
            {
                data: [
                    stats.rating_distribution[1] || 0,
                    stats.rating_distribution[2] || 0,
                    stats.rating_distribution[3] || 0,
                    stats.rating_distribution[4] || 0,
                    stats.rating_distribution[5] || 0,
                ],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(249, 115, 22, 0.6)',
                    'rgba(234, 179, 8, 0.6)',
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(22, 163, 74, 0.6)',
                ],
                borderRadius: 6,
            },
        ],
    };

    return (
        <VendorLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Product Reviews</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage and monitor your product reviews
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    {/* Average Rating */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-gray-500 text-sm font-medium">Average Rating</h2>
                                <p className="text-2xl font-semibold text-gray-900">{stats.average_rating} ★</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Reviews */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-gray-500 text-sm font-medium">Total Reviews</h2>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_reviews}</p>
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-gray-500 text-sm font-medium mb-4">Rating Distribution</h2>
                        <div className="h-[150px]">
                            <Bar 
                                data={ratingData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { 
                                        legend: { 
                                            display: false 
                                        } 
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 1
                                            }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                Filter by Rating
                            </label>
                            <select
                                id="rating"
                                value={selectedRating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            >
                                <option value="">All Ratings</option>
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} Stars
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                                Filter by Product
                            </label>
                            <select
                                id="product"
                                value={selectedProduct}
                                onChange={(e) => handleFilterChange('product', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            >
                                <option value="">All Products</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {reviews.data.length > 0 ? (
                            reviews.data.map((review) => (
                                <div key={review.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={`https://ui-avatars.com/api/?name=${review.user_name}&background=0D9488&color=fff`}
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-gray-900">{review.user_name}</h3>
                                                <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={`/storage/${review.product_image}`}
                                                        alt={review.product_name}
                                                        className="h-8 w-8 rounded object-cover"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-500">{review.product_name}</span>
                                                </div>
                                                <Link
                                                    href={`/vendor/products/${review.product_id}`}
                                                    className="text-sm text-green-600 hover:text-green-700"
                                                >
                                                    View Product →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                No reviews found
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {reviews.links && reviews.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {reviews.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 text-sm border rounded-md ${
                                    link.active
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </VendorLayout>
    );
} 