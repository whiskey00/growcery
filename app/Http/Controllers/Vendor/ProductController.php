<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $products = Product::where('vendor_id', auth()->id())
            ->with('category')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Vendor/Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Vendor/Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'options' => 'nullable|array',
            'image' => 'nullable|image|max:2048',
        ]);

        $data['vendor_id'] = auth()->id();
        $data['options'] = $data['options'] ?? [];

    // Handle image upload
if ($request->hasFile('image')) {
    $storedPath = $request->file('image')->store('products', 'public');

    $source = storage_path('app/public/' . $storedPath);
    $destination = base_path('../public_html/storage/' . $storedPath); // 🔥 FIXED

    File::ensureDirectoryExists(dirname($destination));
    File::copy($source, $destination);

    $data['image'] = $storedPath;
}


        Product::create($data);

        return redirect()
            ->route('vendor.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Vendor/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

public function update(Request $request, Product $product)
{
    $this->authorize('update', $product);

    // Manually extract values from FormData
    $fields = [
        'name' => $request->input('name'),
        'category_id' => $request->input('category_id'),
        'price' => $request->input('price'),
        'quantity' => $request->input('quantity'),
        'description' => $request->input('description'),
        'status' => $request->input('status'),
    ];

    // Decode options if passed as a JSON string
    $options = $request->input('options');
    $fields['options'] = is_string($options) ? json_decode($options, true) : $options ?? [];

    // Handle image upload
if ($request->hasFile('image')) {
    $storedPath = $request->file('image')->store('products', 'public');

    $source = storage_path('app/public/' . $storedPath);
    $destination = base_path('../public_html/storage/' . $storedPath); // 🔥 FIXED

    File::ensureDirectoryExists(dirname($destination));
    File::copy($source, $destination);

    $data['image'] = $storedPath;
}



    // Validate manually
    $validated = validator($fields, [
        'name' => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'price' => 'required|numeric',
        'quantity' => 'required|integer',
        'description' => 'nullable|string',
        'status' => 'required|in:draft,published',
        'options' => 'nullable|array',
        'image' => 'nullable|string|max:2048',
    ])->validate();

    $product->update($validated);

    return redirect()
        ->route('vendor.products.index')
        ->with('success', 'Product updated successfully.');
}



    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();

        return redirect()
            ->route('vendor.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
