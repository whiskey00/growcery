import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Show({ auth, application, idDocumentUrl }) {
    const [showRejectModal, setShowRejectModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    const handleApprove = () => {
        post(route('admin.vendor-applications.approve', application.id));
    };

    const handleReject = (e) => {
        e.preventDefault();
        post(route('admin.vendor-applications.reject', application.id), {
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };

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
        <AdminLayout user={auth.user}>
            <Head title="Review Application" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Review Vendor Application</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(application.status)}`}>
                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="border-t border-gray-200 pt-4">
                                    <dl className="divide-y divide-gray-200">
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.full_name}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.user.email}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.phone_number}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.business_name || 'N/A'}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Farm Address</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.farm_address}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Produce Types</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.produce_types.join(', ')}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {application.description || 'N/A'}
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">ID Document</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                <a
                                                    href={`/admin/vendor-applications/${application.id}/document`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View Document
                                                </a>
                                            </dd>
                                        </div>

                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                            <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                {new Date(application.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {application.status === 'pending' && (
                                    <div className="flex justify-end space-x-4 pt-4 border-t">
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <form onSubmit={handleReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Reject Application
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="rejection_reason" value="Reason for Rejection" />
                        <textarea
                            id="rejection_reason"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.rejection_reason}
                            onChange={e => setData('rejection_reason', e.target.value)}
                            rows="4"
                        />
                        <InputError message={errors.rejection_reason} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setShowRejectModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            disabled={processing}
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
} 