import CustomerLayout from "@/Layouts/CustomerLayout";
import { useState } from "react";
import useCart from "@/Stores/useCart";
import { router } from "@inertiajs/react";

export default function Checkout({ user }) {
  const { cart, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState(user.shipping_address || "");
  const [mobileNumber, setMobileNumber] = useState(user.mobile_number || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const merchandiseSubtotal = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.selectedOption?.price || item.price),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      shipping_address: shippingAddress,
      mobile_number: mobileNumber,
      payment_method: paymentMethod,
      cart,
    };

    router.post("/customer/checkout", payload, {
      onSuccess: () => clearCart(),
      onError: (errors) => console.error("Checkout failed:", errors),
    });
  };

  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6 text-green-700">Checkout</h1>

        {/* Delivery Address */}
        <div className="border rounded mb-6 p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Delivery Address</h2>
          <p className="text-sm font-medium text-gray-800">{user.full_name} <span className="text-gray-500">({mobileNumber})</span></p>
          <p className="text-sm text-gray-600">{shippingAddress}</p>
        </div>

        {/* Products Ordered */}
        <div className="border rounded mb-6 p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Products Ordered</h2>
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`/storage/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-500">Option: {item.selectedOption?.label}</div>
                    <div className="text-sm text-gray-500">₱{Number(item.selectedOption?.price || item.price).toLocaleString()} × {item.quantity}</div>
                  </div>
                </div>
                <div className="font-semibold text-green-700">
                  ₱{(Number(item.selectedOption?.price || item.price) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment and Total Summary */}
        <form onSubmit={handleSubmit} className="border rounded p-4 space-y-6">
          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Method</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="QRPh" disabled>QRPh (Coming Soon)</option>
            </select>
          </div>

          {/* Summary */}
          <div className="text-right space-y-2">
            <p className="text-sm">Merchandise Subtotal: <span className="font-semibold text-gray-800">₱{merchandiseSubtotal.toLocaleString()}</span></p>
            <p className="text-sm">Shipping Fee: <span className="text-gray-800">₱0</span></p>
            <p className="text-lg font-bold text-green-700">Total Payment: ₱{merchandiseSubtotal.toLocaleString()}</p>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-semibold text-sm"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
