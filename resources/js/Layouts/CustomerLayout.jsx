import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';


export default function CustomerLayout({ children }) {
    const { props } = usePage();
    const isLoggedIn = props?.isLoggedIn;
    const user = props?.user;
    const role = props?.role;
    const [search, setSearch] = useState('');


    const getDashboardLink = () => {
        if (role === 'admin') return '/admin';
        if (role === 'vendor') return '/vendor';
        if (role === 'customer') return '/customer';
        return '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <header className="bg-white shadow p-4 sticky top-0 z-50 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img src="/images/green.png" alt="Growcery Logo" className="w-32 h-auto" />
                </Link>

                {/* Centered - Browse + Search */}
                <div className="flex-1 flex justify-center items-center gap-4 mx-6">
                    <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-green-700">Browse</Link>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.get('/products', { search });
                        }}
                        className="flex w-full max-w-xl"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring focus:border-green-500 text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.65 6.15z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Auth buttons */}
                <div className="flex items-center gap-4 text-sm">
                    <Link href="/cart" className="hover:text-green-600">Cart</Link>
                    {isLoggedIn ? (
                        <>
                            <Link href={getDashboardLink()} className="text-green-700">Dashboard</Link>
                            <Link href="/logout" method="post" as="button" className="text-gray-600 hover:underline">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-green-600">Login</Link>
                            <Link href="/register" className="text-green-600 hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="p-4 max-w-7xl mx-auto">
                {children}
            </main>

            <footer className="bg-white border-t text-center text-sm text-gray-500 py-4 mt-8">
                &copy; {new Date().getFullYear()} Growcery. All rights reserved.
            </footer>

        </div>
    );
}
