import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage, Link } from '@inertiajs/react';

export default function ProfileView() {
    const { auth } = usePage().props;
    const user = auth.user;

    const ProfileField = ({ label, value, icon }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                    {icon}
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
                    <p className="text-gray-900 font-medium">{value || '—'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <CustomerLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">My Profile</h1>
                            <p className="text-green-100">Manage your personal information and preferences</p>
                        </div>
                        <Link
                            href="/customer/profile/edit"
                            className="inline-flex items-center px-6 py-3 bg-white text-green-700 border-2 border-white rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-green-50 transition duration-150 ease-in-out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Profile Information Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    <ProfileField 
                        label="Full Name"
                        value={user.full_name}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />

                    <ProfileField 
                        label="Email Address"
                        value={user.email}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                    />

                    <ProfileField 
                        label="Mobile Number"
                        value={user.mobile_number}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />

                    <div className="md:col-span-2">
                        <ProfileField 
                            label="Shipping Address"
                            value={user.shipping_address}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
