import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

export default function ReviewList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            const response = await axios.get(`/customer/products/${productId}/reviews`);
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div>
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100">
            {reviews.map((review) => (
                <div key={review.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                                <span className="text-lg font-semibold text-white">
                                    {(review.user.name || 'A').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                    {review.user.name || 'Anonymous User'}
                                </p>
                                <time className="text-sm text-gray-500">
                                    {formatDate(review.created_at)}
                                </time>
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`h-4 w-4 ${
                                            index < review.rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Review Text */}
                            {review.review && (
                                <p className="mt-3 text-gray-600 text-sm">
                                    {review.review}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 