<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $cartItems = $user->cartItems()
            ->with(['product' => function ($query) {
                $query->with('vendor');
            }])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name,
                    'image' => $item->product->image,
                    'vendor' => $item->product->vendor,
                    'quantity' => $item->quantity,
                    'selectedOption' => [
                        'label' => $item->option_label,
                        'price' => $item->option_price,
                    ],
                ];
            });

        return Inertia::render('Customer/Checkout/Index', [
            'user' => $user,
            'cartItems' => $cartItems,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'mobile_number' => 'required|string',
            'payment_method' => 'required|string|in:COD,QRPh',
        ]);

        Log::info('📦 Starting checkout process');

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $cartItems = $user->cartItems()->with('product')->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Group items by vendor_id
            $grouped = $cartItems->groupBy(function ($item) {
                return $item->product->vendor_id;
            });

            foreach ($grouped as $vendorId => $items) {
                $total = $items->sum(function ($item) {
                    return $item->option_price * $item->quantity;
                });

                $order = Order::create([
                    'user_id' => $user->id,
                    'vendor_id' => $vendorId,
                    'total_price' => $total,
                    'payment_method' => $request->payment_method,
                    'shipping_address' => $request->shipping_address,
                    'status' => 'to_pay',
                ]);

                foreach ($items as $item) {
                    // Check stock availability
                    if ($item->product->quantity < $item->quantity) {
                        throw new \Exception("Not enough stock for {$item->product->name}");
                    }

                    // Attach product to order
                    $order->products()->attach($item->product_id, [
                        'quantity' => $item->quantity,
                        'option_label' => $item->option_label,
                        'option_price' => $item->option_price,
                    ]);

                    // Update product stock
                    $item->product->decrement('quantity', $item->quantity);
                }

                // Delete cart items for this vendor
                $items->each->delete();
            }

            DB::commit();

            return redirect('/customer/orders')->with('success', 'Order placed successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Checkout failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Checkout failed. ' . $e->getMessage()]);
        }
    }
}
