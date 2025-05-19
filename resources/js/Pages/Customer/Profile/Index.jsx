import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage, Link } from '@inertiajs/react';

export default function ProfileView() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <CustomerLayout>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
                <h1 className="text-xl font-bold text-green-700 mb-6">My Profile</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="border rounded p-2 bg-gray-100">{user.full_name || '—'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="border rounded p-2 bg-gray-100">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <p className="border rounded p-2 bg-gray-100">{user.mobile_number || '—'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                        <p className="border rounded p-2 bg-gray-100 whitespace-pre-wrap">
                            {user.shipping_address || '—'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-right">
                    <Link
                        href="/customer/profile/edit"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}
