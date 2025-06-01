<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function show(User $vendor)
    {
        // Ensure the user is a vendor
        if ($vendor->role !== 'vendor') {
            abort(404);
        }

        $vendor->load(['products' => function ($query) {
            $query->where('status', 'published')
                ->orderBy('created_at', 'desc');
        }]);

        return Inertia::render('Customer/Vendor/Show', [
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'full_name' => $vendor->full_name,
                'description' => null,
                'profile_image' => null,
                'address' => $vendor->shipping_address,
                'rating' => null,
            ],
            'products' => $vendor->products->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'image' => $product->image,
            ]),
        ]);
    }
} 