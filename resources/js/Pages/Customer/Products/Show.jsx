import React, { useState } from 'react';
import { usePage, Link, router, Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import useCart from '@/Stores/useCart';
import ReviewList from '@/Components/ReviewList';
import { StarIcon } from '@heroicons/react/20/solid';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import FloatingChatWidget from '@/Components/Chat/FloatingChatWidget';
import { useTranslation } from 'react-i18next';

export default function Show() {
  const { t } = useTranslation();
  const { addToCart } = useCart(); 
  const { product, auth } = usePage().props;
  const [selectedLabel, setSelectedLabel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleAddToCart = () => {
    const selectedOption = product.options.find(opt => opt.label === selectedLabel);

    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity,
      selectedOption,
      price: Number(selectedOption.price),
      vendor_id: product.vendor_id,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleDirectCheckout = () => {
    const selectedOption = product.options.find(opt => opt.label === selectedLabel);

    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    // Use router.post for direct checkout
    router.post('/customer/direct-checkout', {
      product_id: product.id,
      quantity: quantity,
      selectedOption: {
        label: selectedOption.label,
        price: selectedOption.price
      }
    }, {
      preserveState: true, // Preserve the form state
      preserveScroll: true, // Preserve the scroll position
    });
  };

  const handleMessageVendor = () => {
    // Send the initial message using Inertia
    router.post('/messages', {
      receiver_id: product.vendor_id,
      message_text: `Hi, I'm interested in your product: ${product.name}`,
      product_id: product.id
    }, {
      preserveScroll: true,
      onSuccess: () => {
        // Show the chat drawer
        setShowChat(true);
      },
      onError: (errors) => {
        console.error('Failed to send message:', errors);
      }
    });
  };

  return (
    <CustomerLayout>
      <Head title={product.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={`/storage/${product.image}`} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
              
              {/* Vendor Information */}
              {product.vendor && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {product.vendor.full_name?.charAt(0) || 'V'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {product.vendor.full_name}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified Vendor
                      </div>
                      <Link
                        href={route('customer.vendors.show', { vendor: product.vendor.id })}
                        className="mt-2 inline-flex items-center text-sm text-green-600 hover:text-green-700"
                      >
                        Visit Shop
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {product.category.name}
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="mt-4 text-gray-700">{product.description}</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-900">₱{product.price}</p>
                  {product.quantity > 0 ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      In Stock
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-red-500">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              {product.options && product.options.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="option" className="block text-sm font-medium text-gray-700">
                      {t('product.selectOption')}
                    </label>
                    <select
                      id="option"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                      value={selectedLabel}
                      onChange={(e) => setSelectedLabel(e.target.value)}
                    >
                      <option value="">{t('product.selectAnOption')}</option>
                      {product.options.map((opt, idx) => (
                        <option key={idx} value={opt.label}>
                          {opt.label} - ₱{opt.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      {t('product.quantity')}
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <button
                        type="button"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                      >
                        <span className="sr-only">{t('product.decrease')}</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min={1}
                        max={product.quantity}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= product.quantity) {
                            setQuantity(val);
                          }
                        }}
                        className="flex-1 min-w-0 block w-full px-3 py-2 text-center border-gray-300 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => quantity < product.quantity && setQuantity(quantity + 1)}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                      >
                        <span className="sr-only">{t('product.increase')}</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.quantity || !product.options?.length || !selectedLabel}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!selectedLabel ? t('product.selectAnOption') : product.quantity ? t('product.addToCart') : t('product.outOfStock')}
                  {product.quantity > 0 && selectedLabel && (
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleDirectCheckout}
                  disabled={!product.quantity || !product.options?.length || !selectedLabel}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!selectedLabel ? t('product.selectAnOptionToCheckout') : t('product.buyNow')}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                {auth.user && auth.user.role === 'customer' && (
                  <button
                    onClick={handleMessageVendor}
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                    {t('product.messageVendor')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-white border border-green-500 rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{t('product.addedToCartSuccessfully')}</p>
                  <div className="mt-2 flex space-x-3">
                    <Link
                      href="/customer/cart"
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      {t('product.viewCart')}
                    </Link>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="text-sm font-medium text-gray-600 hover:text-gray-500"
                    >
                      {t('product.dismiss')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rating Summary and Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('product.customerReviews')}
            </h2>
            
            {/* Rating Summary */}
            {product.average_rating ? (
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {Number(product.average_rating).toFixed(1)}
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(Number(product.average_rating))
                            ? 'text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{t('product.averageRating')}</div>
                </div>
                
                {/* Rating Distribution - You can add this later when you have the data */}
                <div className="flex-1">
                  {/* Add rating distribution bars here if you want */}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-500">{t('product.noReviewsYet')}</p>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              <ReviewList productId={product.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Add FloatingChatWidget */}
      <FloatingChatWidget key={showChat ? 'open' : 'closed'} initiallyOpen={showChat} />
    </CustomerLayout>
  );
}
