import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ product, categories, vendors }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    vendor_id: product.vendor_id?.toString() ?? '',
    name: product.name ?? '',
    category_id: product.category_id?.toString() ?? '',
    price: product.price?.toString() ?? '',
    quantity: product.quantity?.toString() ?? '',
    description: product.description ?? '',
    status: product.status ?? 'draft',
    options: Array.isArray(product.options) ? product.options : [{ label: '', price: '' }],
    image: undefined,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/products/${product.id}`, {
      forceFormData: true,
      onError: (e) => console.error('❌ Update failed:', e),
      onSuccess: () => console.log('✅ Product updated!'),
    });
  };

  const addOption = () => {
    setData('options', [...data.options, { label: '', price: '' }]);
  };

  const removeOption = (index) => {
    const updated = [...data.options];
    updated.splice(index, 1);
    setData('options', updated);
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...data.options];
    updated[index][field] = value;
    setData('options', updated);
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Vendor Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <select
              className="w-full border px-4 py-2 rounded"
              value={data.vendor_id}
              onChange={(e) => setData('vendor_id', e.target.value)}
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id.toString()}>
                  {vendor.name}
                </option>
              ))}
            </select>
            {errors.vendor_id && <p className="text-sm text-red-600 mt-1">{errors.vendor_id}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border px-4 py-2 rounded"
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            {product.image && (
              <img
                src={`/storage/${product.image}`}
                alt="Current"
                className="mb-2 h-24 rounded object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setData('image', e.target.files[0])}
              className="w-full p-2 border rounded"
            />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                className="w-full border rounded px-4 py-2"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border rounded px-4 py-2"
                value={data.quantity}
                onChange={(e) => setData('quantity', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border rounded px-4 py-2"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border rounded px-4 py-2"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            {data.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Label (e.g. 1kg)"
                  className="w-1/2 border rounded px-3 py-2"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-1/3 border rounded px-3 py-2"
                  value={option.price}
                  onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-blue-600 text-sm mt-1"
            >
              + Add Option
            </button>
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
