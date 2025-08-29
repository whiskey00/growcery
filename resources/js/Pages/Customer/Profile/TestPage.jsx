import CustomerLayout from '@/Layouts/CustomerLayout';
import { useState } from 'react';

export default function TestPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6 text-green-600">🧪 Test Page</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Input Field:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Type here to test focus behavior..."
              />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <strong>Current value:</strong> "{inputValue}"
              <br />
              <strong>Length:</strong> {inputValue.length} characters
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Purpose:</strong> This page tests if we can successfully add new components and if basic input focus works.</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
