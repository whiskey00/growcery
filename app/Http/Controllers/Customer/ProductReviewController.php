<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        // Check if order belongs to user and is completed
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', auth()->id())
            ->where('status', 'completed')
            ->first();

        if (!$order) {
            throw ValidationException::withMessages([
                'order_id' => 'Invalid order or order not completed.',
            ]);
        }

        // Check if product was in this order
        $productInOrder = $order->products()->where('product_id', $validated['product_id'])->exists();
        if (!$productInOrder) {
            throw ValidationException::withMessages([
                'product_id' => 'Product was not in this order.',
            ]);
        }

        // Check for existing review
        $existingReview = ProductReview::where([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id'],
            'order_id' => $validated['order_id'],
        ])->exists();

        if ($existingReview) {
            throw ValidationException::withMessages([
                'review' => 'You have already reviewed this product for this order.',
            ]);
        }

        // Create review
        $review = ProductReview::create([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id'],
            'order_id' => $validated['order_id'],
            'rating' => $validated['rating'],
            'review' => $validated['review'],
        ]);

        // Update product average rating
        $this->updateProductAverageRating($validated['product_id']);

        return back()->with('success', 'Review submitted successfully!');
    }

    private function updateProductAverageRating($productId)
    {
        $avgRating = ProductReview::where('product_id', $productId)
            ->avg('rating');
        
        Product::where('id', $productId)
            ->update(['average_rating' => round($avgRating, 1)]);
    }

    public function index(Product $product)
    {
        $reviews = ProductReview::with('user')
            ->where('product_id', $product->id)
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }
} 