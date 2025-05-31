import CustomerLayout from '@/Layouts/CustomerLayout';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

import {
  regions,
  getProvincesByRegion,
  getCityMunByProvince,
  getBarangayByMun,
} from 'phil-reg-prov-mun-brgy';

export default function Edit({ user }) {
  const { data, setData, put, processing, errors } = useForm({
    full_name: user.full_name || '',
    mobile_number: user.mobile_number || '',
    region_code: user.region_code || '',
    province_code: user.province_code || '',
    city_code: user.city_code || '',
    barangay: user.barangay || '',
    postal_code: user.postal_code || '',
    street_details: user.street_details || '',
  });

  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  useEffect(() => {
    if (data.region_code) {
      setProvinceList(getProvincesByRegion(data.region_code));
      setData('province_code', '');
      setCityList([]);
      setBarangayList([]);
    }
  }, [data.region_code]);

  useEffect(() => {
    if (data.province_code) {
      setCityList(getCityMunByProvince(data.province_code));
      setData('city_code', '');
      setBarangayList([]);
    }
  }, [data.province_code]);

  useEffect(() => {
    if (data.city_code) {
      setBarangayList(getBarangayByMun(data.city_code));
      setData('barangay', '');
    }
  }, [data.city_code]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const region = regions.find(r => r.reg_code === data.region_code)?.name || '';
    const province = provinceList.find(p => p.prov_code === data.province_code)?.name || '';
    const city = cityList.find(c => c.mun_code === data.city_code)?.name || '';

    const shipping_address = `${region}, ${province}, ${city}, ${data.barangay}, ${data.postal_code}, ${data.street_details}`;

    router.put('/customer/profile', {
      full_name: data.full_name,
      mobile_number: data.mobile_number,
      shipping_address,
    }, {
      onSuccess: () => {
        alert('✅ Profile updated successfully!');
        router.visit('/customer/profile');
      },
    });
  };

  const FormField = ({ label, children, error }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const inputClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500";
  const selectClasses = "w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500";

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-green-100">Update your personal information and address</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-2">
              <FormField label="Full Name">
                <input
                  type="text"
                  className={inputClasses}
                  value={data.full_name}
                  onChange={(e) => setData('full_name', e.target.value)}
                />
              </FormField>

              <FormField label="Phone Number">
                <input
                  type="text"
                  className={inputClasses}
                  value={data.mobile_number}
                  onChange={(e) => setData('mobile_number', e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Address Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Region">
                  <select
                    className={selectClasses}
                    value={data.region_code}
                    onChange={(e) => setData('region_code', e.target.value)}
                  >
                    <option value="">Select Region</option>
                    {regions.map(region => (
                      <option key={region.reg_code} value={region.reg_code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Province">
                  <select
                    className={selectClasses}
                    value={data.province_code}
                    onChange={(e) => setData('province_code', e.target.value)}
                    disabled={!provinceList.length}
                  >
                    <option value="">Select Province</option>
                    {provinceList.map(province => (
                      <option key={province.prov_code} value={province.prov_code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="City/Municipality">
                  <select
                    className={selectClasses}
                    value={data.city_code}
                    onChange={(e) => setData('city_code', e.target.value)}
                    disabled={!cityList.length}
                  >
                    <option value="">Select City/Municipality</option>
                    {cityList.map(city => (
                      <option key={city.mun_code} value={city.mun_code}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Barangay">
                  <select
                    className={selectClasses}
                    value={data.barangay}
                    onChange={(e) => setData('barangay', e.target.value)}
                    disabled={!barangayList.length}
                  >
                    <option value="">Select Barangay</option>
                    {barangayList.map((brgy, index) => (
                      <option key={`${brgy.name ?? brgy}-${index}`} value={brgy.name ?? brgy}>
                        {brgy.name ?? brgy}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Postal Code">
                  <input
                    type="text"
                    className={inputClasses}
                    value={data.postal_code}
                    onChange={(e) => setData('postal_code', e.target.value)}
                  />
                </FormField>

                <FormField label="Street Name, Building, House No.">
                  <textarea
                    className={inputClasses}
                    rows="3"
                    value={data.street_details}
                    onChange={(e) => setData('street_details', e.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <a
              href="/customer/profile"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
