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
        $query = Product::with('category')
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

        return Inertia::render('Customer/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'activeSearch' => $request->search,
            'activeCategory' => $request->category,
        ]);
    }
}
