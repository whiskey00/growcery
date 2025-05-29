import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Status({ auth, application }) {
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

    return (
        <CustomerLayout user={auth.user}>
            <Head title="Application Status" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">Vendor Application Status</h2>

                            {application ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Application Details</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(application.status)}`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <dl className="divide-y divide-gray-200">
                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{application.full_name}</dd>
                                            </div>

                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{application.business_name || 'N/A'}</dd>
                                            </div>

                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Farm Address</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{application.farm_address}</dd>
                                            </div>

                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Produce Types</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {application.produce_types.join(', ')}
                                                </dd>
                                            </div>

                                            {application.status === 'rejected' && (
                                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
                                                    <dd className="mt-1 text-sm text-red-600 sm:col-span-2 sm:mt-0">{application.rejection_reason}</dd>
                                                </div>
                                            )}

                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {new Date(application.created_at).toLocaleDateString()}
                                                </dd>
                                            </div>

                                            {application.reviewed_at && (
                                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                    <dt className="text-sm font-medium text-gray-500">Reviewed On</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                        {new Date(application.reviewed_at).toLocaleDateString()}
                                                    </dd>
                                                </div>
                                            )}

                                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Submitted Documents</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    <a
                                                        href={`/customer/vendor-application/${application.id}/document`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View Submitted Document
                                                    </a>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">You haven't submitted a vendor application yet.</p>
                                    <a
                                        href={route('customer.vendor-application.create')}
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
} 