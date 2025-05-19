import React from "react";
import { usePage, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function ProductBrowse({ products, categories, activeSearch, activeCategory }) {
    const handleSearch = (e) => {
        router.get('/products', { search: e.target.value, category: activeCategory }, { preserveState: true });
    };

    const handleCategoryClick = (category) => {
        router.get('/products', { search: activeSearch, category }, { preserveState: true });
    };

    const handleAddToCart = (productId) => {
        alert(`Added product ${productId} to cart!`);
    };

    return (
        <CustomerLayout>
            <div className="flex gap-6">
                {/* Sidebar */}
                <aside className="w-64 hidden md:block">
                    <div className="bg-white rounded shadow p-4">
                        <h2 className="font-bold text-lg mb-2">Categories</h2>
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`w-full text-left px-3 py-1 rounded text-sm ${activeCategory === cat ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1">
                    {/* Search Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-green-700">All Products</h1>
                        <input
                            type="text"
                            placeholder="Search products..."
                            defaultValue={activeSearch}
                            onChange={handleSearch}
                            className="p-2 border rounded w-full max-w-sm"
                        />
                    </div>

                    {/* Filter tag */}
                    {(activeSearch || activeCategory) && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing results for:
                            {activeSearch && <span className="ml-2 font-medium">"{activeSearch}"</span>}
                            {activeCategory && <span className="ml-2 italic">in {activeCategory}</span>}
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {products.data.map(product => (
                            <div key={product.id} className="bg-white rounded shadow p-3 hover:shadow-md">
                                <img
                                    src={product.image ? `/storage/${product.image}` : 'https://placehold.co/300x200?text=No+Image'} 
                                    alt={product.name}
                                    className="w-full h-36 object-cover rounded mb-2"
                                />
                                <h2 className="font-semibold text-sm">{product.name}</h2>
                                <p className="text-green-600 font-bold text-sm">₱{product.price}</p>
                                <p className="text-xs text-gray-500">{product.category?.name}</p>
                                <div className="mt-2 flex gap-2 items-stretch">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="flex-1 text-center text-sm text-white bg-green-600 py-2 rounded hover:bg-green-700"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
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

                    {/* Pagination */}
                    {products.links?.length > 3 && (
                        <div className="mt-6 flex justify-center gap-2 flex-wrap">
                            {products.links.map((link, i) => (
                                <button
                                    key={i}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url)}
                                    className={`px-3 py-1 border rounded text-sm ${
                                        link.active ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-100'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
