import React, { useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
    const { t } = useTranslation();
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const faqData = [
        {
            category: "Getting Started",
            questions: [
                {
                    question: "How do I create an account on Growcery?",
                    answer: "You can create an account by clicking the 'Register' button on the top right of the page. Fill in your details including your full name, email, mobile number, and shipping address. You can also sign up using your Google account for faster registration."
                },
                {
                    question: "How do I place an order?",
                    answer: "Browse our products, select the items you want, choose your preferred options (size, weight, etc.), and add them to your cart. When you're ready, go to checkout, review your order, enter your shipping details, choose your payment method, and confirm your order."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We currently accept Cash on Delivery (COD) and QR Ph payments. For QR Ph, you can scan the QR code provided during checkout to complete your payment instantly."
                }
            ]
        },
        {
            category: "Orders & Delivery",
            questions: [
                {
                    question: "How can I track my order?",
                    answer: "You can track your order status by logging into your account and visiting the 'My Orders' section. You'll see real-time updates including: To Pay, To Ship, To Receive, Completed, or Cancelled status."
                },
                {
                    question: "What are the delivery options?",
                    answer: "We deliver fresh produce directly from local farmers to your doorstep. Delivery times depend on your location and the vendor's processing time. You'll receive updates as your order progresses through each stage."
                },
                {
                    question: "Can I cancel or modify my order?",
                    answer: "You can cancel orders that are still in 'To Pay' status. Once an order moves to 'To Ship' or beyond, cancellation may not be possible. Contact the vendor directly through our messaging system for any modifications."
                },
                {
                    question: "What if I receive damaged or incorrect items?",
                    answer: "If you receive damaged or incorrect items, please contact the vendor immediately through our messaging system. Take photos of the items and describe the issue. Vendors will work with you to resolve the problem, which may include replacement or refund."
                }
            ]
        },
        {
            category: "Products & Quality",
            questions: [
                {
                    question: "How fresh are the products?",
                    answer: "All products come directly from local farmers and vendors, ensuring maximum freshness. Each product listing shows the vendor information, and you can read reviews from other customers to gauge quality and freshness."
                },
                {
                    question: "Can I see product reviews?",
                    answer: "Yes! Each product has a rating system and customer reviews. You can see the average rating displayed as stars and read detailed reviews from verified customers who have purchased the product."
                },
                {
                    question: "What if a product is out of stock?",
                    answer: "Out-of-stock products are clearly marked with a gray overlay and 'Out of Stock' badge. You can't add these items to your cart. We recommend checking back regularly as farmers restock their products frequently."
                },
                {
                    question: "How do I know about product options and variants?",
                    answer: "Each product may have different options such as size, weight, or packaging. These are clearly displayed on the product page. Select your preferred option before adding to cart, as prices may vary by option."
                }
            ]
        },
        {
            category: "Account & Profile",
            questions: [
                {
                    question: "How do I update my shipping address?",
                    answer: "Go to your profile settings by clicking on your name in the top navigation, then select 'Edit Profile'. You can update your shipping address, which will be used for all future orders."
                },
                {
                    question: "How do I contact a vendor?",
                    answer: "You can message vendors directly through our built-in messaging system. Look for the chat icon or 'Message Vendor' button on product pages or in your order details. This allows real-time communication about products, orders, or any questions."
                },
                {
                    question: "Can I become a vendor?",
                    answer: "Yes! If you're a farmer or produce vendor, you can apply to become a vendor on our platform. Visit your profile settings and look for the 'Become a Vendor' option. Submit your application with required documents, and our admin team will review it."
                }
            ]
        },
        {
            category: "For Vendors",
            questions: [
                {
                    question: "How do I add products to my store?",
                    answer: "Once approved as a vendor, access your vendor dashboard, go to 'Products', and click 'Add Product'. Fill in product details, upload images, set pricing and options, and publish your products."
                },
                {
                    question: "How do I manage orders?",
                    answer: "In your vendor dashboard, go to 'Orders' to see all incoming orders. You can update order status from 'To Pay' to 'To Ship' to 'To Receive' as you process and deliver orders."
                },
                {
                    question: "How do I communicate with customers?",
                    answer: "Use the built-in messaging system to communicate with customers. You'll receive notifications for new messages and can respond directly through your vendor dashboard."
                },
                {
                    question: "How are payments processed?",
                    answer: "Customer payments are processed through the platform. You'll receive payment confirmation and can track your earnings through the vendor dashboard analytics."
                }
            ]
        }
    ];

    return (
        <CustomerLayout>
            <Head title="Frequently Asked Questions - Growcery" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Find answers to common questions about using Growcery, our marketplace for fresh produce from local farmers.
                        </p>
                    </div>

                    {/* FAQ Sections */}
                    <div className="space-y-8">
                        {faqData.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Category Header */}
                                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                                    <h2 className="text-xl font-semibold text-green-800">
                                        {category.category}
                                    </h2>
                                </div>

                                {/* Questions */}
                                <div className="divide-y divide-gray-200">
                                    {category.questions.map((faq, index) => {
                                        const itemKey = `${categoryIndex}-${index}`;
                                        const isOpen = openItems[itemKey];

                                        return (
                                            <div key={index} className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleItem(itemKey)}
                                                    className="w-full text-left flex items-center justify-between py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
                                                >
                                                    <span className="text-lg font-medium text-gray-900 pr-4">
                                                        {faq.question}
                                                    </span>
                                                    <span className="flex-shrink-0">
                                                        {isOpen ? (
                                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                </button>
                                                
                                                {isOpen && (
                                                    <div className="mt-3 pr-8">
                                                        <p className="text-gray-700 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
                        <h3 className="text-2xl font-semibold text-green-800 mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@growcery.com"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Support
                            </a>
                            <a
                                href="tel:+639123456789"
                                className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
