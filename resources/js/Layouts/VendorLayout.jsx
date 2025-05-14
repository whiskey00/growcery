import React from 'react';
import { Link } from '@inertiajs/react';

const VendorLayout = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col justify-between p-5 md:w-1/4 lg:w-1/5">
                <div>
                    <Link href="/" className="block mb-6">
                        <img src="/images/white.png" alt="Growcery Logo" className="w-36 h-auto mx-auto" />
                    </Link>
                    <ul>
                        <li className="mb-4">
                            <Link href="/vendor/dashboard" className="text-white hover:bg-gray-700 p-2 rounded block">Dashboard</Link>
                        </li>
                        <li className="mb-4">
                            <Link href="/vendor/products" className="text-white hover:bg-gray-700 p-2 rounded block">Products</Link>
                        </li>
                        <li className="mb-4">
                            <Link href="/vendor/orders" className="text-white hover:bg-gray-700 p-2 rounded block">Orders</Link>
                        </li>
                        <li className="mb-4">
                            <Link href="/vendor/profile" className="text-white hover:bg-gray-700 p-2 rounded block">Profile</Link>
                        </li>
                    </ul>
                </div>

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="text-sm bg-red-600 text-white w-full text-center py-2 rounded hover:bg-red-700 mt-4"
                >
                    Logout
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-y-auto">
                <div className="container mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default VendorLayout;
