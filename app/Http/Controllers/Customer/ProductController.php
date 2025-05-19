<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    public function show($id)
    {
        $product = Product::with('category', 'vendor')->findOrFail($id);

        return Inertia::render('Customer/Products/Show', [
            'product' => $product,
        ]);
    }
}
