<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('products')->where('user_id', auth()->id());

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
        $order->load('products'); 
        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }

}
