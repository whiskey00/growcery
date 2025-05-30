import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';
import useCart from '@/Stores/useCart';

export default function Landing({ isLoggedIn, user, role, featuredProducts }) {
    const { addToCart } = useCart();

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

        alert(`Added ${product.name} to cart!`);
    };

    return (
        <CustomerLayout>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to Growcery</h1>
                <p className="text-gray-700">Fresh produce from trusted local farmers. Buy directly, support locally.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <a href="/products" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        Start Shopping
                    </a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded shadow p-4 hover:shadow-md">
                            <img
                                src={product.image ? `/storage/${product.image}` : "https://placehold.co/300x200?text=No+Image"}
                                alt={product.name}
                                className="w-full h-36 object-cover rounded mb-2"
                            />
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category?.name}</p>
                            <p className="text-green-600 font-bold text-sm mb-2">₱{product.price}</p>
                            <div className="flex gap-2">
                                <Link
                                    href={`/customer/products/${product.id}`}
                                    className="flex-1 flex items-center justify-center text-white bg-green-600 py-1 rounded hover:bg-green-700 text-sm"
                                >
                                    View
                                </Link>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 flex items-center justify-center"
                                    title="Add to Cart"
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
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
