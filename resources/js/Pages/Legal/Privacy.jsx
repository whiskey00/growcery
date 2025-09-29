import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
    const { t } = useTranslation();

    return (
        <CustomerLayout>
            <Head title="Privacy Policy - Growcery" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your information on Growcery.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-8 space-y-8">
                            {/* Introduction */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Introduction
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Welcome to Growcery, a marketplace connecting customers with local farmers and produce vendors. 
                                    We are committed to protecting your personal information and your right to privacy. This Privacy 
                                    Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    By using Growcery, you agree to the collection and use of information in accordance with this policy.
                                </p>
                            </section>

                            {/* Information We Collect */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Information We Collect
                                </h2>
                                
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Personal Information
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We collect personal information that you provide to us, including:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Full name and contact information (email, phone number)</li>
                                    <li>Shipping and billing addresses</li>
                                    <li>Account credentials (username, password)</li>
                                    <li>Profile information and preferences</li>
                                    <li>Payment information (processed securely through our payment partners)</li>
                                    <li>Communications with vendors and support team</li>
                                </ul>

                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Automatically Collected Information
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    When you use our platform, we automatically collect certain information:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Device information (IP address, browser type, operating system)</li>
                                    <li>Usage data (pages visited, time spent, features used)</li>
                                    <li>Location data (if you enable location services)</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>

                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Information from Third Parties
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We may receive information from third parties, such as:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Social media platforms (when you sign up using Google or other social logins)</li>
                                    <li>Payment processors for transaction verification</li>
                                    <li>Analytics providers to improve our services</li>
                                </ul>
                            </section>

                            {/* How We Use Information */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    How We Use Your Information
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We use the information we collect for the following purposes:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>To provide and maintain our marketplace services</li>
                                    <li>To process transactions and manage orders</li>
                                    <li>To communicate with you about your account and orders</li>
                                    <li>To facilitate communication between customers and vendors</li>
                                    <li>To improve our platform and develop new features</li>
                                    <li>To personalize your experience and show relevant products</li>
                                    <li>To detect and prevent fraud and security issues</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To send you marketing communications (with your consent)</li>
                                </ul>
                            </section>

                            {/* Information Sharing */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Information Sharing and Disclosure
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We may share your information in the following circumstances:
                                </p>
                                
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    With Vendors
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    When you place an order, we share necessary information with vendors including your name, 
                                    contact details, and shipping address to fulfill your order.
                                </p>

                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    With Service Providers
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We work with third-party service providers who help us operate our platform, including:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Payment processors for secure transactions</li>
                                    <li>Cloud hosting providers for data storage</li>
                                    <li>Email service providers for communications</li>
                                    <li>Analytics providers for platform improvement</li>
                                </ul>

                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Legal Requirements
                                </h3>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We may disclose your information if required by law or in response to valid requests 
                                    by public authorities.
                                </p>
                            </section>

                            {/* Data Security */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Data Security
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We implement appropriate technical and organizational security measures to protect your 
                                    personal information against unauthorized access, alteration, disclosure, or destruction. 
                                    These measures include:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Encryption of sensitive data in transit and at rest</li>
                                    <li>Regular security assessments and updates</li>
                                    <li>Access controls and authentication measures</li>
                                    <li>Secure payment processing through certified providers</li>
                                    <li>Regular backups and disaster recovery procedures</li>
                                </ul>
                            </section>

                            {/* Your Rights */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Your Rights and Choices
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You have the following rights regarding your personal information:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                    <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                                    <li><strong>Portability:</strong> Receive your personal information in a structured format</li>
                                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                                    <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    To exercise these rights, please contact us using the information provided below.
                                </p>
                            </section>

                            {/* Cookies */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Cookies and Tracking Technologies
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We use cookies and similar tracking technologies to enhance your experience on our platform. 
                                    These technologies help us:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                                    <li>Remember your preferences and settings</li>
                                    <li>Keep you logged in during your session</li>
                                    <li>Analyze usage patterns and improve our services</li>
                                    <li>Provide personalized content and recommendations</li>
                                </ul>
                                <p className="text-gray-700 leading-relaxed">
                                    You can control cookie settings through your browser preferences, though some features 
                                    may not function properly if cookies are disabled.
                                </p>
                            </section>

                            {/* Data Retention */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Data Retention
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We retain your personal information for as long as necessary to provide our services, 
                                    comply with legal obligations, resolve disputes, and enforce our agreements. When we 
                                    no longer need your information, we will securely delete or anonymize it.
                                </p>
                            </section>

                            {/* Changes to Policy */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Changes to This Privacy Policy
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We may update this Privacy Policy from time to time to reflect changes in our practices 
                                    or legal requirements. We will notify you of any material changes by posting the new 
                                    Privacy Policy on this page and updating the "Last updated" date. We encourage you to 
                                    review this Privacy Policy periodically.
                                </p>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Contact Us
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                                </p>
                                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Email:</strong> privacy@growcery.com
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
                                                <strong>Address:</strong> Growcery Headquarters<br />
                                                123 Agriculture Street<br />
                                                Manila, Philippines 1000
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
