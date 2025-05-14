<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;

class VendorDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $totalSales = Order::where('vendor_id', $user->id)->sum('total_price');
        $totalOrders = Order::where('vendor_id', $user->id)->count();

        $bestSelling = Product::withCount('orders')
            ->where('vendor_id', $user->id)
            ->orderByDesc('orders_count')
            ->first();

        return Inertia::render('Vendor/Dashboard', [
            'totalSales' => $totalSales,
            'totalOrders' => $totalOrders,
            'bestSelling' => $bestSelling?->name ?? 'No products yet',
        ]);
    }
}
