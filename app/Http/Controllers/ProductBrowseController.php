<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class ProductBrowseController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'vendor:id,name,full_name'])
            ->where('status', 'published');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        $products = $query->latest()->paginate(12)->withQueryString();

        $categories = Category::orderBy('name')->pluck('name');

        // Get top 10 best sellers based on order count
        $bestSellers = Product::with(['category', 'vendor:id,name,full_name'])
            ->where('status', 'published')
            ->select('products.*')
            ->selectRaw('(SELECT COUNT(*) FROM order_product WHERE order_product.product_id = products.id) as orders_count')
            ->having('orders_count', '>', 0)
            ->orderByDesc('orders_count')
            ->take(10)
            ->get();

        return Inertia::render('Customer/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'activeSearch' => $request->search,
            'activeCategory' => $request->category,
            'bestSellers' => $bestSellers,
        ]);
    }
}
