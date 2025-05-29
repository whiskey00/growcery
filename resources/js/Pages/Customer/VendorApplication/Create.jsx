import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth, user, produceTypes }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        console.log('Produce Types received:', produceTypes);
        setCategories(Array.isArray(produceTypes) ? produceTypes : []);
    }, [produceTypes]);

    const { data, setData, post, processing, errors } = useForm({
        full_name: user.name || '',
        phone_number: user.mobile_number || '',
        business_name: '',
        farm_address: '',
        produce_types: [],
        id_document: null,
        description: '',
        declaration: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customer/vendor-application', {
            onSuccess: () => {
                window.location.href = '/customer/vendor-application/status';
            }
        });
    };

    const handleFileChange = (e) => {
        setData('id_document', e.target.files[0]);
    };

    const handleProduceTypeChange = (type) => {
        const updatedTypes = data.produce_types.includes(type)
            ? data.produce_types.filter(t => t !== type)
            : [...data.produce_types, type];
        setData('produce_types', updatedTypes);
    };

    return (
        <CustomerLayout user={auth.user}>
            <Head title="Vendor Application" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-8 border-b border-gray-200 pb-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Vendor Application</h2>
                                <p className="text-gray-600">Join our growing community of vendors and start selling your fresh produce on Growcery.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Personal Information Section */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                                </svg>
                                                Personal Information
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <InputLabel htmlFor="full_name" value="Full Name" />
                                                    <TextInput
                                                        id="full_name"
                                                        type="text"
                                                        name="full_name"
                                                        value={data.full_name}
                                                        className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm transition-colors"
                                                        onChange={e => setData('full_name', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.full_name} className="mt-2" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="email" value="Email Address" />
                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        value={user.email}
                                                        className="mt-1 block w-full bg-gray-50 border-gray-200"
                                                        disabled
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                                                    <TextInput
                                                        id="phone_number"
                                                        type="text"
                                                        name="phone_number"
                                                        value={data.phone_number}
                                                        className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm transition-colors"
                                                        onChange={e => setData('phone_number', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.phone_number} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Information Section */}
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                                </svg>
                                                Business Information
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <InputLabel htmlFor="business_name" value="Farm/Business Name (Optional)" />
                                                    <TextInput
                                                        id="business_name"
                                                        type="text"
                                                        name="business_name"
                                                        value={data.business_name}
                                                        className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm transition-colors"
                                                        onChange={e => setData('business_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.business_name} className="mt-2" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor="farm_address" value="Farm Address / Barangay" />
                                                    <TextInput
                                                        id="farm_address"
                                                        type="text"
                                                        name="farm_address"
                                                        value={data.farm_address}
                                                        className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm transition-colors"
                                                        onChange={e => setData('farm_address', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.farm_address} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Categories Section */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Product Categories
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">Select the categories of products you plan to sell:</p>
                                    
                                    {categories.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {categories.map((type) => (
                                                <label key={type} className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors">
                                                    <Checkbox
                                                        name="produce_types[]"
                                                        value={type}
                                                        checked={data.produce_types.includes(type)}
                                                        onChange={() => handleProduceTypeChange(type)}
                                                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 transition-colors cursor-pointer checked:bg-green-500 checked:hover:bg-green-600"
                                                    />
                                                    <span className="text-gray-700">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 border border-gray-200 rounded-md">
                                            <p className="text-gray-600">No categories available at the moment.</p>
                                            <p className="text-sm text-gray-500 mt-1">Please try again later or contact support.</p>
                                        </div>
                                    )}
                                    <InputError message={errors.produce_types} className="mt-2" />
                                </div>

                                {/* Documents & Description Section */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                        Additional Information
                                    </h3>
                                    
                                    {/* ID Document Upload */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="id_document" value="Valid ID Document" />
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                id="id_document"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                required
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Upload a government-issued ID or barangay certificate (PDF, JPG, PNG, max 5MB)
                                        </p>
                                        <InputError message={errors.id_document} className="mt-2" />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <InputLabel htmlFor="description" value="About Your Business (Optional)" />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            rows="4"
                                            className="mt-1 block w-full border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm transition-colors"
                                            placeholder="Tell us about your farming experience, products, and business..."
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>

                                {/* Declaration */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="declaration"
                                            checked={data.declaration}
                                            onChange={e => setData('declaration', e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 transition-colors cursor-pointer checked:bg-green-500 checked:hover:bg-green-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            I confirm that all the information provided is true and accurate. I understand that providing false information may result in the rejection of my application.
                                        </span>
                                    </label>
                                    <InputError message={errors.declaration} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
} 