<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductBrowseController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->where('status', 'published');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $products = $query->latest()->paginate(12)->withQueryString();

        $categories = Product::select('category')->distinct()->orderBy('category')->pluck('category');

        return Inertia::render('Customer/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'activeSearch' => $request->search,
            'activeCategory' => $request->category,
        ]);
    }

}
