import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';
import debounce from 'lodash/debounce';

export default function Index({ products }) {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            router.delete(`/vendor/products/${id}`);
        }
    };

    const handlePageChange = (url) => {
        if (url) window.location.href = url;
    };

    // Create a debounced search function
    const debouncedSearch = debounce((query) => {
        setIsSearching(true);
        router.get('/vendor/products', { search: query }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    }, 300);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearch(query);
        debouncedSearch(query);
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            debouncedSearch.cancel();
        };
    }, []);

    return (
        <VendorLayout>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Products</h1>
                        <p className="mt-1 sm:mt-2 text-sm text-gray-700">
                            Manage your product catalog
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link
                            href="/vendor/products/create"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="w-full sm:max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">Search products</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={search}
                            onChange={handleSearch}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Search products"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products List */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {isMobileView ? (
                        // Mobile Card View
                        <div className="divide-y divide-gray-200">
                            {products.data && products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <div key={product.id} className="p-4">
                                        <div className="flex items-center">
                                            <img
                                                className="h-16 w-16 rounded-lg object-cover"
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.category?.name || '—'}</div>
                                                <div className="text-sm font-medium text-gray-900 mt-1">₱{Number(product.price).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                                                </div>
                                                <div className="flex space-x-3">
                                                    <Link
                                                        href={`/vendor/products/${product.id}/edit`}
                                                        className="text-sm text-green-600 hover:text-green-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-sm text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No products found
                                </div>
                            )}
                        </div>
                    ) : (
                        // Desktop Table View
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.data && products.data.length > 0 ? (
                                        products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{product.category?.name || '—'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">₱{Number(product.price).toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{product.quantity}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        product.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link
                                                        href={`/vendor/products/${product.id}/edit`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                No products found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {products.links && (
                    <div className="flex justify-center gap-1 sm:gap-2">
                        {products.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => handlePageChange(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm border rounded-md ${
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
