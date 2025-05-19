<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $recentOrders = Order::with('products')
            ->where('user_id', auth()->id())
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'recentOrders' => $recentOrders,
        ]);
    }
}
