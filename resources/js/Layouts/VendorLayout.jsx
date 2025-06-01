import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { HomeIcon } from '@heroicons/react/24/outline';
import FloatingChatWidget from '@/Components/Chat/FloatingChatWidget';

const VendorLayout = ({ children }) => {
    const { post } = useForm();
    const { actingAs, auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleViewSwitch = () => {
        post(route('vendor.switch-view'));
    };

    // Determine the button text based on current view
    const switchButtonText = actingAs === 'customer' ? 'Switch to Vendor View' : 'Switch to Customer View';

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
                {/* Logo */}
                <div className="p-4 border-b">
                    <Link href="/" className="block">
                        <img src="/images/green.png" alt="Growcery Logo" className="w-32 h-auto mx-auto" />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <Link 
                        href="/vendor/dashboard"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg group"
                    >
                        <HomeIcon className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>

                    <Link 
                        href="/vendor/products"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg group"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Products
                    </Link>

                    <Link 
                        href="/vendor/orders"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg group"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Orders
                    </Link>

                    <Link 
                        href="/vendor/reviews"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg group"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Reviews
                    </Link>
                </nav>

                {/* User Profile & Actions */}
                <div className="p-4 border-t space-y-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                            {auth?.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{auth?.user?.name}</p>
                            <p className="text-xs text-gray-500">Vendor</p>
                        </div>
                    </div>

                    <button
                        onClick={handleViewSwitch}
                        className="w-full flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {switchButtonText}
                    </button>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Background overlay */}
                <div 
                    className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'opacity-75' : 'opacity-0'
                    }`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
                
                {/* Sidebar */}
                <div className={`relative flex flex-col w-full max-w-xs bg-white h-full transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-opacity duration-300 ease-in-out"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile menu content */}
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="px-4">
                            <img src="/images/green.png" alt="Growcery Logo" className="w-32 h-auto mx-auto" />
                        </div>

                        <nav className="mt-5 flex-1 px-4 space-y-1">
                            <Link 
                                href="/vendor/dashboard"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <HomeIcon className="w-5 h-5 mr-3" />
                                Dashboard
                            </Link>

                            <Link 
                                href="/vendor/products"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Products
                            </Link>

                            <Link 
                                href="/vendor/orders"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Orders
                            </Link>

                            <Link 
                                href="/vendor/reviews"
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Reviews
                            </Link>
                        </nav>

                        <div className="border-t border-gray-200 p-4 space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                                    {auth?.user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{auth?.user?.name}</p>
                                    <p className="text-xs text-gray-500">Vendor</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    handleViewSwitch();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                {switchButtonText}
                            </button>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="md:hidden">
                                <button 
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 md:flex md:items-center md:justify-between">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Vendor Dashboard
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Add FloatingChatWidget */}
            <FloatingChatWidget />
        </div>
    );
};

export default VendorLayout;
