<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\ProductReview;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['products', 'vendor:id,name,full_name'])
            ->where('user_id', auth()->id());

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'activeStatus' => $request->status ?? 'all',
        ]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Load the order with its relationships
        $order->load([
            'products' => function($query) {
                $query->select('products.id', 'name', 'image');
            },
            'vendor:id,name,full_name'
        ]);

        // Get reviewed products for this order
        $reviewedProducts = ProductReview::where('order_id', $order->id)
            ->where('user_id', auth()->id())
            ->pluck('product_id')
            ->toArray();

        // Add has_review flag to each product
        foreach ($order->products as $product) {
            $product->has_review = in_array($product->id, $reviewedProducts);
        }

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }
}
