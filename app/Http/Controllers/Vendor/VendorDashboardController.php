<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
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

        // 🔹 Monthly earnings (last 12 months)
        $monthlyEarnings = Order::where('vendor_id', $user->id)
            ->selectRaw('MONTH(created_at) as month, SUM(total_price) as total')
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month');

        // 🔹 Top-selling products by order count (for pie chart)
        $topSelling = Product::where('vendor_id', $user->id)
            ->withCount('orders')
            ->orderByDesc('orders_count')
            ->take(5)
            ->get()
            ->map(fn($p) => [
                'name' => $p->name,
                'orders' => $p->orders_count,
            ]);

        // 🔹 Recent orders (latest 5)
        $recentOrders = Order::where('vendor_id', $user->id)
            ->latest()
            ->take(5)
            ->with('products:id,name')
            ->get();

        return Inertia::render('Vendor/Dashboard', [
            'totalSales' => $totalSales,
            'totalOrders' => $totalOrders,
            'bestSelling' => $bestSelling?->name ?? 'N/A',
            'monthlyEarnings' => $monthlyEarnings,
            'topSelling' => $topSelling,
            'recentOrders' => $recentOrders,
        ]);
    }
}
