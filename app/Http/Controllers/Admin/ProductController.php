<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['vendor', 'category'])->latest()->paginate(10);
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $vendors = User::where('role', 'vendor')->get();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Products/Create', [
            'vendors' => $vendors,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vendor_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'required|in:published,draft',
            'description' => 'nullable|string',
            'options' => 'nullable|array',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $data['options'] = $data['options'] ?? [];

        Product::create($data);

        return redirect()->route('admin.products.index')->with('success', 'Product added successfully.');
    }

    public function edit(Product $product)
    {
        $vendors = User::where('role', 'vendor')->get();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'vendors' => $vendors,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'vendor_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'status' => 'required|in:published,draft',
            'description' => 'nullable|string',
            'options' => 'nullable|array',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $data['options'] = $data['options'] ?? [];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
