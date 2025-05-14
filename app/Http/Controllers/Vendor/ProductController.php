<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProductController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $products = Product::where('vendor_id', auth()->id())
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Vendor/Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Vendor/Products/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'options' => 'nullable|array',
        ]);

        $data['vendor_id'] = auth()->id();
        $data['options'] = $data['options'] ?? [];

        Product::create($data);

        return redirect()
            ->route('vendor.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        return Inertia::render('Vendor/Products/Edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorize('update', $product);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'options' => 'nullable|array',
        ]);

        $data['options'] = $data['options'] ?? [];

        $product->update($data);

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
