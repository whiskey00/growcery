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
        $order->load([
            'products' => function ($q) {
                $q->select('products.id', 'name', 'price')->withPivot('quantity', 'option_label', 'option_price');
            },
            'vendor',
            'user'
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

}
