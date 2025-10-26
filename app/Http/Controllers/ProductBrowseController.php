<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\User;

class ProductBrowseController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'vendor:id,name,full_name'])
            ->where('status', 'published');

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('vendor', function ($vendorQuery) use ($searchTerm) {
                      $vendorQuery->where('name', 'like', '%' . $searchTerm . '%')
                                  ->orWhere('full_name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        if ($request->filled('vendor')) {
            $query->whereHas('vendor', function ($q) use ($request) {
                $q->where('name', $request->vendor);
            });
        }

        $products = $query->latest()->paginate(12)->withQueryString();

        $categories = Category::orderBy('name')->get(['id', 'name', 'name_tagalog']);

        // Get top 10 best sellers based on order count
        $bestSellers = Product::with(['category', 'vendor:id,name,full_name'])
            ->where('status', 'published')
            ->select('products.*')
            ->selectRaw('(SELECT COUNT(*) FROM order_product WHERE order_product.product_id = products.id) as orders_count')
            ->having('orders_count', '>', 0)
            ->orderByDesc('orders_count')
            ->take(10)
            ->get();

        // Get top vendors based on their products' average ratings
        $topVendors = User::where('role', 'vendor')
            ->whereHas('products', function ($query) {
                $query->where('status', 'published')
                      ->where('average_rating', '>', 0);
            })
            ->withCount(['products as total_products' => function ($query) {
                $query->where('status', 'published');
            }])
            ->selectRaw('users.*, (
                SELECT AVG(average_rating) 
                FROM products 
                WHERE products.vendor_id = users.id 
                AND products.status = "published" 
                AND products.average_rating > 0
            ) as avg_rating')
            ->having('avg_rating', '>', 0)
            ->orderByDesc('avg_rating')
            ->take(5)
            ->get();

        return Inertia::render('Customer/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'activeSearch' => $request->search,
            'activeCategory' => $request->category,
            'activeVendor' => $request->vendor,
            'bestSellers' => $bestSellers,
            'topVendors' => $topVendors,
        ]);
    }
}
