<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $ordersQuery = Order::with(['products', 'vendor']);

        if ($status) {
            $ordersQuery->where('status', $status);
        }

        $orders = $ordersQuery->latest()->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'activeStatus' => $status
        ]);
    }

    public function show(Order $order)
    {
        // Load the order with all relationships
        $order->load([
            'products' => function ($q) {
                $q->select('products.id', 'name', 'price')->withPivot('quantity', 'option_label', 'option_price');
            },
            'vendor',
            'user'
        ]);

        // Get the business name manually
        $businessName = $order->vendor->vendorApplication?->business_name ?? 'N/A';

        // Add business name to the order data
        $order->business_name = $businessName;

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

}
