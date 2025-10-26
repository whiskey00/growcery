import React from 'react';
import { useForm } from '@inertiajs/react';
import VendorLayout from '@/Layouts/VendorLayout';

export default function Edit({ product, categories }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'put',
    name: product?.name ?? '',
    category_id: product?.category_id?.toString() ?? '',
    price: product?.price?.toString() ?? '',
    quantity: product?.quantity?.toString() ?? '',
    description: product?.description ?? '',
    status: product?.status ?? 'draft',
    date_harvested: product?.date_harvested ?? '',
    expected_lifespan_days: product?.expected_lifespan_days?.toString() ?? '',
    options: Array.isArray(product?.options) ? product.options : [{ label: '', price: '' }],
    image: undefined,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/vendor/products/${product.id}`, {
      forceFormData: true,
      onError: (e) => console.error("❌ Update failed:", e),
      onSuccess: () => console.log("✅ Product updated successfully!"),
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
    <VendorLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border rounded px-4 py-2"
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
            >
              <option value="">Select a category</option>
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

          {/* Expiry Information */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Expiry Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add harvest date and expected lifespan to track product expiry and receive notifications.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Harvested
                  <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-4 py-2"
                  value={data.date_harvested}
                  onChange={(e) => setData('date_harvested', e.target.value)}
                />
                {errors.date_harvested && <p className="text-red-600 text-sm mt-1">{errors.date_harvested}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Lifespan (Days)
                  <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g., 7 for 7 days"
                  className="w-full border rounded px-4 py-2"
                  value={data.expected_lifespan_days}
                  onChange={(e) => setData('expected_lifespan_days', e.target.value)}
                />
                {errors.expected_lifespan_days && <p className="text-red-600 text-sm mt-1">{errors.expected_lifespan_days}</p>}
              </div>
            </div>
            {data.date_harvested && data.expected_lifespan_days && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Expiry Date:</strong> {new Date(new Date(data.date_harvested).getTime() + parseInt(data.expected_lifespan_days) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            )}
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
            <button type="button" onClick={addOption} className="text-blue-600 text-sm mt-1">
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
    </VendorLayout>
  );
}
