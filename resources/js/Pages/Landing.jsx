import React from 'react';
import { Link } from '@inertiajs/react';

export default function Landing({ isLoggedIn, role }) {

    const getDashboardLink = () => {
        if (role === 'admin') return '/admin';
        if (role === 'vendor') return '/vendor';
        if (role === 'customer') return '/customer';
        return '/dashboard'; // fallback
    };

    return (
        <div className="bg-gray-100 text-gray-800">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-4 bg-white shadow">
                        <h1 className="text-xl font-bold text-green-700">Growcery</h1>

                        {isLoggedIn ? (
                            <div className="flex gap-4">
                                <Link
                                    href={getDashboardLink()}
                                    className="text-sm text-green-700 hover:underline"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-600 hover:underline"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link href="/login" className="text-sm text-gray-600 hover:text-green-600">Login</Link>
                                <Link href="/register" className="text-sm text-green-600 font-medium hover:underline">Register</Link>
                            </div>
                        )}
                </nav>

            {/* Hero Banner */}
            <section className="w-full h-64 bg-green-200 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Farm Fresh to Your Table</h2>
                    <p className="text-sm text-gray-700">Buy directly from trusted local farmers</p>
                </div>
            </section>

            {/* Categories */}
            <section className="py-6 px-4 max-w-6xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {["Vegetables", "Fruits", "Rice", "Bundles", "Leafy Greens", "Root Crops"].map((cat, idx) => (
                        <div key={idx} className="bg-white rounded shadow p-3 text-center hover:shadow-md cursor-pointer">
                            <img src={`https://placehold.co/100x100?text=${cat}`} alt={cat} className="mx-auto mb-2" />
                            <p className="text-sm font-medium">{cat}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-6 px-4 max-w-6xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(id => (
                        <div key={id} className="bg-white rounded shadow hover:shadow-md">
                            <img src="https://placehold.co/300x200?text=Product" alt="Product" className="w-full h-40 object-cover rounded-t" />
                            <div className="p-3">
                                <p className="text-sm font-semibold">Organic Tomatoes</p>
                                <p className="text-green-600 font-bold text-sm mt-1">₱75 / kg</p>
                                <button className="mt-2 w-full bg-green-600 text-white text-sm py-1 rounded hover:bg-green-700">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-center text-sm text-gray-500 py-4 mt-10 border-t">
                © {new Date().getFullYear()} Growcery. All rights reserved.
            </footer>
        </div>
    );
}
