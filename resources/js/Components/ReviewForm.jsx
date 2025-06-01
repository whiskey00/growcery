import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { useForm } from '@inertiajs/react';

export default function ReviewForm({ productId, orderId, onSuccess }) {
    const [hoveredRating, setHoveredRating] = useState(0);
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: productId,
        order_id: orderId,
        rating: 0,
        review: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customer/reviews', {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    const renderStars = (type = 'active') => {
        return [...Array(5)].map((_, index) => {
            const rating = index + 1;
            const isActive = type === 'hover' ? rating <= hoveredRating : rating <= data.rating;
            
            return (
                <button
                    key={`${type}-${rating}`}
                    type="button"
                    className={`${
                        isActive ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 focus:outline-none`}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setData('rating', rating)}
                >
                    <StarIcon className="h-6 w-6" />
                </button>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                </label>
                <div className="flex gap-1">
                    {renderStars(hoveredRating > 0 ? 'hover' : 'active')}
                </div>
                {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
            </div>

            <div>
                <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Review (Optional)
                </label>
                <textarea
                    id="review"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Share your experience with this product..."
                    value={data.review}
                    onChange={e => setData('review', e.target.value)}
                />
                {errors.review && (
                    <p className="mt-1 text-sm text-red-600">{errors.review}</p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing || data.rating === 0}
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Review
                </button>
            </div>
        </form>
    );
} 