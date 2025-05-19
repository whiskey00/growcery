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

  console.log('🧾 FINAL payload:', {
    full_name: data.full_name,
    mobile_number: data.mobile_number,
    shipping_address,
  });

router.put('/customer/profile', {
  full_name: data.full_name,
  mobile_number: data.mobile_number,
  shipping_address,
}, {
  onSuccess: () => {
    alert('✅ Profile updated successfully!');
    router.visit('/customer/profile'); // redirect to view page
  },
});


};



  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-xl font-bold mb-4">New Address</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                className="w-full border p-2 rounded"
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                className="w-full border p-2 rounded"
                value={data.mobile_number}
                onChange={(e) => setData('mobile_number', e.target.value)}
              />
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium">Region</label>
            <select
              className="w-full border p-2 rounded"
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
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium">Province</label>
            <select
              className="w-full border p-2 rounded"
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
          </div>

          {/* City/Municipality */}
          <div>
            <label className="block text-sm font-medium">City/Municipality</label>
            <select
              className="w-full border p-2 rounded"
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
          </div>

          {/* Barangay */}
          <div>
            <label className="block text-sm font-medium">Barangay</label>
            <select
              className="w-full border p-2 rounded"
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
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input
              className="w-full border p-2 rounded"
              value={data.postal_code}
              onChange={(e) => setData('postal_code', e.target.value)}
            />
          </div>

          {/* Street Details */}
          <div>
            <label className="block text-sm font-medium">Street Name, Building, House No.</label>
            <textarea
              className="w-full border p-2 rounded"
              value={data.street_details}
              onChange={(e) => setData('street_details', e.target.value)}
            />
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={processing}>
            Save Address
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
