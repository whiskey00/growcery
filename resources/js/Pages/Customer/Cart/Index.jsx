import CustomerLayout from "@/Layouts/CustomerLayout";
import useCart from "@/Stores/useCart";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => {
    const price = Number(item.price || 0);
    return sum + price * item.quantity;
  }, 0);

  return (
    <CustomerLayout>
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.2a1 1 0 001 .8h12.6a1 1 0 001-.8L21 13M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, idx) => {
                const price = Number(item.price || 0);
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white shadow rounded-lg p-4 border"
                  >
                    <div className="w-20 h-20">
                      <img
                        src={`/storage/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded border"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Option: {item.selectedOption?.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₱{price.toLocaleString()} × {item.quantity}
                      </p>
                      <p className="text-green-700 font-semibold">
                        Subtotal: ₱{subtotal.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.selectedOption?.label)
                      }
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total + Checkout */}
            <div className="flex justify-end mt-10">
              <div className="text-right space-y-3">
                <div className="text-xl font-bold text-green-700">
                  Total: ₱{total.toLocaleString()}
                </div>
                <a
                  href="/customer/checkout"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg inline-block"
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
