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

            $orders = [];
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
                $orders[] = $order;
            }

            DB::commit();

            // If it's a QR Ph payment, return the order data instead of redirecting
            if ($request->payment_method === 'QRPh') {
                return response()->json([
                    'success' => true,
                    'order' => $orders[0]
                ]);
            }

            return redirect('/customer/orders')->with('success', 'Order placed successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Checkout failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Checkout failed. ' . $e->getMessage()]);
        }
    }

    public function directCheckout(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'selectedOption.label' => 'required|string',
            'selectedOption.price' => 'required|numeric|min:0',
        ]);

        $product = Product::with('vendor')->findOrFail($validated['product_id']);

        // Check if product is in stock
        if ($product->quantity < $validated['quantity']) {
            return back()->with('error', 'Not enough stock available.');
        }

        // Check if option exists in product
        $optionExists = collect($product->options)->contains(function ($option) use ($validated) {
            return $option['label'] === $validated['selectedOption']['label'] &&
                   (float) $option['price'] === (float) $validated['selectedOption']['price'];
        });

        if (!$optionExists) {
            return back()->with('error', 'Invalid product option.');
        }

        $user = auth()->user();

        return Inertia::render('Customer/Checkout/Index', [
            'user' => $user,
            'cartItems' => [
                [
                    'id' => 'temp',
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image,
                    'vendor' => $product->vendor,
                    'quantity' => $validated['quantity'],
                    'selectedOption' => [
                        'label' => $validated['selectedOption']['label'],
                        'price' => $validated['selectedOption']['price'],
                    ],
                ]
            ],
        ]);
    }

    public function completeDirectCheckout(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'mobile_number' => 'required|string',
            'payment_method' => 'required|string|in:COD,QRPh',
            'items' => 'required|array|size:1',
            'items.0.product_id' => 'required|exists:products,id',
            'items.0.quantity' => 'required|integer|min:1',
            'items.0.selectedOption.label' => 'required|string',
            'items.0.selectedOption.price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $user = auth()->user();
            $item = $request->items[0];
            $product = Product::with('vendor')->findOrFail($item['product_id']);

            // Check stock availability
            if ($product->quantity < $item['quantity']) {
                throw new \Exception("Not enough stock for {$product->name}");
            }

            // Check if option exists in product
            $optionExists = collect($product->options)->contains(function ($option) use ($item) {
                return $option['label'] === $item['selectedOption']['label'] &&
                       (float) $option['price'] === (float) $item['selectedOption']['price'];
            });

            if (!$optionExists) {
                throw new \Exception('Invalid product option.');
            }

            $total = $item['selectedOption']['price'] * $item['quantity'];

            $order = Order::create([
                'user_id' => $user->id,
                'vendor_id' => $product->vendor_id,
                'total_price' => $total,
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'status' => 'to_pay',
            ]);

            // Attach product to order
            $order->products()->attach($product->id, [
                'quantity' => $item['quantity'],
                'option_label' => $item['selectedOption']['label'],
                'option_price' => $item['selectedOption']['price'],
            ]);

            // Update product stock
            $product->decrement('quantity', $item['quantity']);

            DB::commit();

            // If it's a QR Ph payment, return the order data instead of redirecting
            if ($request->payment_method === 'QRPh') {
                return response()->json([
                    'success' => true,
                    'order' => $order
                ]);
            }

            return redirect('/customer/orders')->with('success', 'Order placed successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Direct checkout failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Checkout failed. ' . $e->getMessage()]);
        }
    }
}
