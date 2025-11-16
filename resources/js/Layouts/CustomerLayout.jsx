import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import ChatWidget from '@/Components/Chat/ChatWidget';

export default function CustomerLayout({ children }) {
    const { auth, cartItems } = usePage().props;
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(search)}`;
        }
    };

    const cartItemCount = cartItems?.length || 0;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <header className="bg-green-600 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-100 hover:bg-green-700"
                            >
                                <span className="sr-only">{showMobileMenu ? 'Close menu' : 'Open menu'}</span>
                                {showMobileMenu ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Logo - Centered on mobile */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center">
                                <img src="/images/white.png" alt="Growcery Logo" className="h-8 w-auto" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <Link
                                href="/products"
                                className="text-white hover:text-green-100 px-3 py-2 text-sm font-medium"
                            >
                                {t('common.browseProducts')}
                            </Link>
                            <form onSubmit={handleSearch} className="relative w-96">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t('common.searchProducts')}
                                    className="w-full bg-green-700/50 border border-green-500 text-white placeholder-green-200 text-sm rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent py-2 pl-10 pr-4"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </form>

                            {auth.user && (
                                <Link
                                    href="/customer/dashboard"
                                    className="text-white hover:text-green-100 px-3 py-2 text-sm font-medium"
                                >
                                    {t('common.dashboard')}
                                </Link>
                            )}
                        </div>

                        {/* Desktop Right Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {/* Language Switcher */}
                            <LanguageSwitcher />
                            
                            {auth.user ? (
                                <>
                                    <Link
                                        href="/customer/cart"
                                        className="relative text-white hover:text-green-100 p-2 group"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-green-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Profile Dropdown */}
                                    <div className="relative group">
                                        <button className="flex items-center text-white hover:text-green-100">
                                            <img
                                                className="h-8 w-8 rounded-full border-2 border-green-500"
                                                src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=0D9488&color=fff`}
                                                alt=""
                                            />
                                        </button>
                                        <div className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <Link
                                                href="/customer/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('common.yourProfile')}
                                            </Link>
                                            {auth.user.role !== 'vendor' && !auth.vendorApplication && (
                                                <Link
                                                    href="/customer/vendor-application/create"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {t('common.becomeAVendor')}
                                                </Link>
                                            )}
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('common.signOut')}
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href="/login"
                                        className="text-white hover:text-green-100"
                                    >
                                        {t('common.login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        {t('common.register')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Right Navigation */}
                        <div className="flex items-center md:hidden">
                            {auth.user && (
                                <Link href="/customer/cart" className="relative p-2 text-white hover:text-green-100">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartItemCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-yellow-400 text-green-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`${showMobileMenu ? 'block' : 'hidden'} md:hidden border-t border-green-500 pt-2 pb-3`}>
                        <div className="space-y-1">
                            <form onSubmit={handleSearch} className="px-4 pb-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={t('common.searchProducts')}
                                        className="w-full bg-green-700/50 border border-green-500 text-white placeholder-green-200 text-sm rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent py-2 pl-10 pr-4"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </form>
                            <Link
                                href="/products"
                                className="block px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                            >
                                {t('common.browseProducts')}
                            </Link>
                            {auth.user ? (
                                <>
                                    <Link
                                        href="/customer/dashboard"
                                        className="block px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                                    >
                                        {t('common.dashboard')}
                                    </Link>
                                    <Link
                                        href="/customer/profile"
                                        className="block px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                                    >
                                        {t('common.yourProfile')}
                                    </Link>
                                    {auth.user.role !== 'vendor' && !auth.vendorApplication && (
                                        <Link
                                            href="/customer/vendor-application/create"
                                            className="block px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                                        >
                                            {t('common.becomeAVendor')}
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                                    >
                                        {t('common.signOut')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                                    >
                                        {t('common.login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block px-4 py-2 text-base font-medium text-white hover:bg-green-700"
                                    >
                                        {t('common.register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Floating Chat Widget */}
            {auth.user && <ChatWidget />}

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <img src="/images/green.png" alt="Growcery Logo" className="h-8 w-auto" />
                            <p className="text-sm text-gray-600">
                                Your trusted marketplace for fresh produce directly from local farmers.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('common.quickLinks')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/products" className="text-sm text-gray-600 hover:text-green-600">
                                        {t('common.browseProducts')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/customer/orders" className="text-sm text-gray-600 hover:text-green-600">
                                        {t('common.myOrders')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/customer/profile" className="text-sm text-gray-600 hover:text-green-600">
                                        {t('common.myProfile')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Help & Support */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('common.helpSupport')}</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/customer/profile" className="text-sm text-gray-600 hover:text-green-600">
                                        {t('common.becomeAVendor')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-sm text-gray-600 hover:text-green-600">
                                        {t('common.contactUs')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="text-sm text-gray-600 hover:text-green-600">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('common.contact')}</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@growcery.com
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +1 (234) 567-8900
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p className="text-sm text-gray-600">
                                © {new Date().getFullYear()} Growcery. All rights reserved.
                            </p>
                            <div className="flex space-x-6">
                                <Link href="/privacy" className="text-sm text-gray-600 hover:text-green-600">
                                    {t('common.privacyPolicy')}
                                </Link>
                                <Link href="/terms" className="text-sm text-gray-600 hover:text-green-600">
                                    {t('common.termsOfService')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
