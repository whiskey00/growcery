import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/20/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function Show({ vendor, products }) {
    const vendorInitial = vendor.name?.charAt(0) || vendor.full_name?.charAt(0) || '?';
    
    return (
        <CustomerLayout>
            <Head title={`${vendor.name || vendor.full_name} - Vendor Profile`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Vendor Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-500">
                        <div className="absolute -bottom-16 left-8">
                            {vendor.profile_image ? (
                                <img
                                    src={vendor.profile_image}
                                    alt={vendor.name || vendor.full_name}
                                    className="w-32 h-32 rounded-lg object-cover ring-4 ring-white bg-white"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-lg ring-4 ring-white bg-white flex items-center justify-center">
                                    <span className="text-4xl font-bold text-green-600">{vendorInitial}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="pt-20 pb-6 px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {vendor.name || vendor.full_name}
                                    </h1>
                                    <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                                </div>
                                
                                {vendor.address && (
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                                        {vendor.address}
                                    </div>
                                )}
                            </div>

                            {vendor.rating && (
                                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                    <StarIcon className="h-5 w-5 text-yellow-400" />
                                    <span className="ml-1 text-sm font-medium text-green-700">
                                        {vendor.rating}
                                    </span>
                                </div>
                            )}
                        </div>

                        {vendor.description && (
                            <p className="mt-4 text-gray-600 text-sm">{vendor.description}</p>
                        )}
                    </div>
                </div>

                {/* Products Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Products</h2>
                        <span className="text-sm text-gray-500">{products.length} items</span>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/customer/products/${product.id}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition duration-200 hover:shadow-md hover:border-green-200">
                                        <div className="aspect-square overflow-hidden bg-gray-50">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                                                {product.name}
                                            </h3>
                                            
                                            {product.description && (
                                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}
                                            
                                            <p className="mt-2 text-lg font-semibold text-green-600">
                                                ₱{Number(product.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-gray-100 p-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    This vendor has no products available at the moment.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
} 