import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import React, { useState, useEffect } from 'react';

export default function Index({ auth, applications = [] }) {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
            router.delete(`/admin/vendor-applications/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Vendor Applications" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Vendor Applications</h1>
                        <p className="mt-1 sm:mt-2 text-sm text-gray-700">
                            Review and manage vendor applications
                        </p>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {isMobileView ? (
                        // Mobile Card View
                        <div className="divide-y divide-gray-200">
                            {applications?.data?.length > 0 ? (
                                applications.data.map((application) => (
                                    <div key={application.id} className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0">
                                                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-base font-medium text-gray-600">
                                                        {application.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {application.user.name}
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">{application.user.email}</div>
                                                <div className="mt-2">
                                                    <div className="text-sm font-medium text-gray-900">Business Name:</div>
                                                    <div className="text-sm text-gray-500">{application.business_name}</div>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    Applied on: {new Date(application.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <Link
                                                href={`/admin/vendor-applications/${application.id}`}
                                                className="text-sm text-blue-600 hover:text-blue-900"
                                            >
                                                View Details
                                            </Link>
                                            {application.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => router.post(`/admin/vendor-applications/${application.id}/approve`)}
                                                        className="text-sm text-green-600 hover:text-green-900"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => router.post(`/admin/vendor-applications/${application.id}/reject`)}
                                                        className="text-sm text-red-600 hover:text-red-900"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(application.id)}
                                                className="text-sm text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No applications found
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
                                            Applicant
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applied On
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications?.data?.length > 0 ? (
                                        applications.data.map((application) => (
                                            <tr key={application.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {application.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {application.user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {application.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{application.business_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(application.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center space-x-4">
                                                        <Link
                                                            href={`/admin/vendor-applications/${application.id}`}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        {application.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => router.post(`/admin/vendor-applications/${application.id}/approve`)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => router.post(`/admin/vendor-applications/${application.id}/reject`)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(application.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No applications found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
} 