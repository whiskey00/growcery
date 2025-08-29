<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Support\Facades\DB;

class VendorDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $totalSales = Order::where('vendor_id', $user->id)->sum('total_price');
        $totalOrders = Order::where('vendor_id', $user->id)->count();
        
        // Additional metrics
        $totalProducts = Product::where('vendor_id', $user->id)->count();
        $activeProducts = Product::where('vendor_id', $user->id)->where('status', 'active')->count();
        $lowStockProducts = Product::where('vendor_id', $user->id)->where('quantity', '<=', 10)->count();
        
        // This month's performance
        $thisMonth = Carbon::now()->startOfMonth();
        $thisMonthSales = Order::where('vendor_id', $user->id)
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_price');
        $thisMonthOrders = Order::where('vendor_id', $user->id)
            ->where('created_at', '>=', $thisMonth)
            ->count();

        $bestSelling = Product::where('vendor_id', $user->id)
            ->select('products.*')
            ->selectRaw('(SELECT COUNT(*) FROM order_product WHERE order_product.product_id = products.id) as orders_count')
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
            ->select('products.*')
            ->selectRaw('(SELECT COUNT(*) FROM order_product WHERE order_product.product_id = products.id) as orders_count')
            ->orderByDesc('orders_count')
            ->take(5)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'orders' => (int) $p->orders_count,
                'revenue' => (float) Order::join('order_product', 'orders.id', '=', 'order_product.order_id')
                    ->join('products', 'order_product.product_id', '=', 'products.id')
                    ->where('order_product.product_id', $p->id)
                    ->where('orders.vendor_id', $user->id)
                    ->sum(\DB::raw('products.price * order_product.quantity')),
                'image' => $p->image,
            ]);
            
        // Remove debug logging for production
        // \Log::info('Top Selling Products:', $topSelling->toArray());

        // 🔹 Recent orders (latest 5)
        $recentOrders = Order::where('vendor_id', $user->id)
            ->latest()
            ->take(5)
            ->with('products:id,name')
            ->get();

        // Get all products for this vendor
        $productIds = Product::where('vendor_id', $user->id)->pluck('id');

        // Calculate average rating
        $averageRating = ProductReview::whereIn('product_id', $productIds)
            ->avg('rating') ?? 0;

        // Get rating distribution
        $ratingDistribution = ProductReview::whereIn('product_id', $productIds)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        // Get recent reviews
        $recentReviews = ProductReview::whereIn('product_id', $productIds)
            ->with(['user:id,name', 'product:id,name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($review) => [
                'id' => $review->id,
                'user_name' => $review->user->name,
                'product_id' => $review->product_id,
                'product_name' => $review->product->name,
                'rating' => $review->rating,
                'comment' => $review->review,
                'created_at' => $review->created_at,
            ]);

        return Inertia::render('Vendor/Dashboard', [
            'totalSales' => $totalSales,
            'totalOrders' => $totalOrders,
            'totalProducts' => $totalProducts,
            'activeProducts' => $activeProducts,
            'lowStockProducts' => $lowStockProducts,
            'thisMonthSales' => $thisMonthSales,
            'thisMonthOrders' => $thisMonthOrders,
            'bestSelling' => $bestSelling?->name ?? 'N/A',
            'monthlyEarnings' => $monthlyEarnings,
            'topSelling' => $topSelling,
            'recentOrders' => $recentOrders,
            'averageRating' => round($averageRating, 1),
            'ratingDistribution' => $ratingDistribution,
            'recentReviews' => $recentReviews,
        ]);
    }
}
