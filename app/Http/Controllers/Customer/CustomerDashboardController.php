<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\VendorApplication;
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

        $vendorApplication = VendorApplication::where('user_id', auth()->id())
            ->latest()
            ->first();

        return Inertia::render('Customer/Dashboard', [
            'recentOrders' => $recentOrders,
            'vendorApplication' => $vendorApplication,
        ]);
    }
}
