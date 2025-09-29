import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Terms() {
    const { t } = useTranslation();

    return (
        <CustomerLayout>
            <Head title="Terms of Service - Growcery" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Please read these terms carefully before using Growcery. By using our platform, you agree to these terms and conditions.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-8 space-y-8">
                            {/* Acceptance of Terms */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    1. Acceptance of Terms
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    By accessing and using Growcery ("Platform", "Service", "we", "us", or "our"), you accept and agree 
                                    to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, 
                                    please do not use this service.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    These Terms of Service apply to all users of the platform, including customers, vendors, and visitors.
                                </p>
                            </section>

                            {/* Description of Service */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    2. Description of Service
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Growcery is an online marketplace that connects customers with local farmers and produce vendors. 
                                    Our platform facilitates the buying and selling of fresh agricultural products, including but not 
                                    limited to fruits, vegetables, herbs, and other farm produce.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    We provide the platform and tools for transactions but are not directly involved in the actual 
                                    sale of products between customers and vendors.
                                </p>
                            </section>

                            {/* User Accounts */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    3. User Accounts and Registration
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    To access certain features of our platform, you must register for an account. When creating an account, you agree to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Provide accurate, current, and complete information</li>
                                    <li>Maintain and update your information to keep it accurate</li>
                                    <li>Keep your login credentials secure and confidential</li>
                                    <li>Accept responsibility for all activities under your account</li>
                                    <li>Notify us immediately of any unauthorized use of your account</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    You must be at least 18 years old to create an account and use our services.
                                </p>
                            </section>

                            {/* User Responsibilities */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    4. User Responsibilities and Prohibited Uses
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You agree to use Growcery only for lawful purposes. You are prohibited from:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Violating any applicable laws or regulations</li>
                                    <li>Posting false, misleading, or fraudulent information</li>
                                    <li>Selling prohibited, illegal, or unsafe products</li>
                                    <li>Harassing, threatening, or intimidating other users</li>
                                    <li>Attempting to gain unauthorized access to our systems</li>
                                    <li>Using the platform for spam or unsolicited communications</li>
                                    <li>Interfering with the normal operation of the platform</li>
                                    <li>Infringing on intellectual property rights</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to suspend or terminate accounts that violate these terms.
                                </p>
                            </section>

                            {/* Vendor Terms */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    5. Vendor Terms and Conditions
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If you are a vendor on our platform, you additionally agree to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Provide accurate product descriptions, prices, and availability</li>
                                    <li>Fulfill orders promptly and provide quality products</li>
                                    <li>Maintain appropriate licenses and permits for your business</li>
                                    <li>Handle customer service and resolve disputes professionally</li>
                                    <li>Comply with all applicable food safety and agricultural regulations</li>
                                    <li>Update product information regularly, including stock availability</li>
                                    <li>Respond to customer inquiries in a timely manner</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Vendors are responsible for the quality, safety, and legality of their products.
                                </p>
                            </section>

                            {/* Orders and Payments */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    6. Orders, Payments, and Refunds
                                </h2>
                                
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Order Processing
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    When you place an order, you are making an offer to purchase products from the vendor. 
                                    Orders are subject to vendor acceptance and product availability.
                                </p>

                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Pricing and Payment
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    All prices are displayed in Philippine Peso (PHP) and include applicable taxes unless otherwise stated. 
                                    We accept the following payment methods:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Cash on Delivery (COD)</li>
                                    <li>QR Ph payments</li>
                                </ul>

                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Cancellations and Refunds
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Order cancellations and refunds are subject to vendor policies and the following conditions:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Orders can typically be cancelled while in "To Pay" status</li>
                                    <li>Refunds for damaged or incorrect products are handled case-by-case</li>
                                    <li>Fresh produce sales may have limited return options due to perishability</li>
                                    <li>Refund processing times vary by payment method</li>
                                </ul>
                            </section>

                            {/* Intellectual Property */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    7. Intellectual Property Rights
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    The Growcery platform, including its design, functionality, content, and trademarks, is owned by 
                                    Growcery and is protected by intellectual property laws. You are granted a limited, non-exclusive, 
                                    non-transferable license to use the platform for its intended purposes.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    By uploading content (such as product images or descriptions), you grant us a non-exclusive license 
                                    to use, display, and distribute that content on our platform.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    You retain ownership of your content but warrant that you have the right to grant us this license.
                                </p>
                            </section>

                            {/* Privacy and Data */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    8. Privacy and Data Protection
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Your privacy is important to us. Our collection, use, and protection of your personal information 
                                    is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    By using our platform, you consent to the collection and use of your information as described 
                                    in our Privacy Policy.
                                </p>
                            </section>

                            {/* Disclaimers */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    9. Disclaimers and Limitation of Liability
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Growcery provides the platform "as is" without warranties of any kind. We disclaim all warranties, 
                                    express or implied, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Merchantability and fitness for a particular purpose</li>
                                    <li>Accuracy, reliability, or completeness of information</li>
                                    <li>Uninterrupted or error-free operation</li>
                                    <li>Security of data transmission</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We are not responsible for:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Product quality, safety, or legality</li>
                                    <li>Vendor performance or fulfillment</li>
                                    <li>Disputes between customers and vendors</li>
                                    <li>Third-party actions or content</li>
                                    <li>Technical issues or system downtime</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Our liability is limited to the maximum extent permitted by law.
                                </p>
                            </section>

                            {/* Dispute Resolution */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    10. Dispute Resolution
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We encourage users to resolve disputes amicably through our messaging system. For unresolved issues:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Contact our support team for mediation assistance</li>
                                    <li>Provide relevant documentation and evidence</li>
                                    <li>Work cooperatively toward a fair resolution</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    Any legal disputes shall be governed by the laws of the Philippines and subject to the 
                                    jurisdiction of Philippine courts.
                                </p>
                            </section>

                            {/* Termination */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    11. Account Termination
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We reserve the right to suspend or terminate your account at any time for:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Violation of these Terms of Service</li>
                                    <li>Fraudulent or illegal activities</li>
                                    <li>Abuse of other users or our staff</li>
                                    <li>Extended periods of inactivity</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    You may also terminate your account at any time by contacting our support team. 
                                    Termination does not affect existing orders or legal obligations.
                                </p>
                            </section>

                            {/* Changes to Terms */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    12. Changes to Terms of Service
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We reserve the right to modify these Terms of Service at any time. Changes will be effective 
                                    immediately upon posting on our platform. Material changes will be communicated to users via 
                                    email or platform notifications.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    Your continued use of the platform after changes constitutes acceptance of the new terms.
                                </p>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    13. Contact Information
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If you have questions about these Terms of Service, please contact us:
                                </p>
                                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Email:</strong> legal@growcery.com
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Phone:</strong> +63 912 345 6789
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Address:</strong> Growcery Legal Department<br />
                                                123 Agriculture Street<br />
                                                Manila, Philippines 1000
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Effective Date */}
                            <section className="border-t pt-8">
                                <p className="text-sm text-gray-500 text-center">
                                    These Terms of Service are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                                    and supersede all prior versions.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
