import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import useCart from '@/Stores/useCart';

export default function Show() {
  const { addToCart } = useCart(); 
  const { product } = usePage().props;
  const [selectedLabel, setSelectedLabel] = useState('');
  const [quantity, setQuantity] = useState(1);

  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img src={`/storage/${product.image}`} alt={product.name} className="rounded shadow w-full" />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600">by {product.vendor.full_name}</p>
            <p className="mt-2 text-sm text-gray-500">{product.category.name}</p>

            <p className="mt-4 text-xl text-green-600 font-semibold">₱{product.price}</p>

            {/* Options */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Options:</label>
              <select
                className="mt-1 w-full border rounded p-2"
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
              >
                <option value="">Select an option</option>
                {product.options.map((opt, idx) => (
                  <option key={idx} value={opt.label}>
                    {opt.label} - ₱{opt.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Quantity:</label>
              <input
                type="number"
                min={1}
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="mt-1 w-20 border rounded p-2"
              />
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => {
                const selectedOption = product.options.find(opt => opt.label === selectedLabel);

                if (!selectedOption) {
                  alert('Please select an option');
                  return;
                }

                addToCart({
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  quantity,
                  selectedOption,
                  price: Number(selectedOption.price),
                  vendor_id: product.vendor_id,
                });

                alert('Added to cart!');
              }}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>

            {/* Description */}
            <div className="mt-6">
              <p className="text-sm text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
