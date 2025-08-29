import CustomerLayout from '@/Layouts/CustomerLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditTest({ user }) {
  const { data, setData, put, processing, errors } = useForm({
    postal_code: user.postal_code || '',
    street_details: user.street_details || '',
  });

  const [localPostalCode, setLocalPostalCode] = useState(user.postal_code || '');
  const [localStreetDetails, setLocalStreetDetails] = useState(user.street_details || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', { postal_code: localPostalCode, street_details: localStreetDetails });
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">Test Profile Edit</h1>
          <p className="text-green-100">Minimal test form to debug cursor focus issue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Test Fields</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code (Local State)
                </label>
                <input
                  type="text"
                  value={localPostalCode}
                  onChange={(e) => setLocalPostalCode(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Type here to test focus..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Details (Local State)
                </label>
                <textarea
                  value={localStreetDetails}
                  onChange={(e) => setLocalStreetDetails(e.target.value)}
                  rows="3"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Type here to test focus..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code (Inertia Form)
                </label>
                <input
                  type="text"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Type here to test focus..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Details (Inertia Form)
                </label>
                <textarea
                  value={data.street_details}
                  onChange={(e) => setData('street_details', e.target.value)}
                  rows="3"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Type here to test focus..."
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Test Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
