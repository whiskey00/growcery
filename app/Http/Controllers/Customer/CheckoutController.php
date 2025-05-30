<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return Inertia::render('Customer/Checkout/Index', [
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'mobile_number' => 'required|string',
            'payment_method' => 'required|string|in:COD,QRPh',
            'cart' => 'required|array|min:1',
        ]);

        Log::info('📦 Multi-vendor checkout:', $request->all());

        DB::beginTransaction();

        try {
            $user = auth()->user();

            // Group items by vendor_id
            $grouped = collect($request->cart)->groupBy(fn($item) => $item['vendor_id']);

            foreach ($grouped as $vendorId => $items) {
                $total = $items->sum(fn($item) => (float) $item['price'] * (int) $item['quantity']);

                $order = Order::create([
                    'user_id' => $user->id,
                    'vendor_id' => $vendorId,
                    'total_price' => $total,
                    'payment_method' => $request->payment_method,
                    'shipping_address' => $request->shipping_address,
                    'status' => 'to_pay',
                ]);

                foreach ($items as $item) {
                    $order->products()->attach($item['id'], [
                        'quantity' => $item['quantity'],
                        'option_label' => $item['selectedOption']['label'] ?? null,
                        'option_price' => $item['selectedOption']['price'] ?? $item['price'],
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('customer.orders.index')->with('success', 'Order placed successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Checkout failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Checkout failed. ' . $e->getMessage()]);
        }
    }

}
