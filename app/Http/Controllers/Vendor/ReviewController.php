<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get all products for this vendor
        $productIds = Product::where('vendor_id', $user->id)->pluck('id');

        // Build query for reviews
        $query = ProductReview::whereIn('product_id', $productIds)
            ->with(['user:id,name', 'product:id,name,image']);

        // Apply filters if any
        if ($request->filled('rating')) {
            $query->where('rating', (int) $request->rating);
        }

        if ($request->filled('product')) {
            $query->where('product_id', (int) $request->product);
        }

        // Get reviews with pagination
        $reviews = $query->latest()
            ->paginate(10)
            ->through(fn($review) => [
                'id' => $review->id,
                'user_name' => $review->user->name,
                'product_id' => $review->product_id,
                'product_name' => $review->product->name,
                'product_image' => $review->product->image,
                'rating' => $review->rating,
                'comment' => $review->review,
                'created_at' => $review->created_at,
            ]);

        // Get statistics based on filtered results
        $statsQuery = ProductReview::whereIn('product_id', $productIds);
        
        // Apply the same filters for consistent stats
        if ($request->filled('rating')) {
            $statsQuery->where('rating', (int) $request->rating);
        }
        if ($request->filled('product')) {
            $statsQuery->where('product_id', (int) $request->product);
        }

        $stats = [
            'average_rating' => round($statsQuery->avg('rating') ?? 0, 1),
            'total_reviews' => $statsQuery->count(),
            'rating_distribution' => $statsQuery->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray(),
        ];

        // Get products for filter
        $products = Product::where('vendor_id', $user->id)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Vendor/Reviews/Index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'products' => $products,
            'filters' => [
                'rating' => $request->rating,
                'product' => $request->product,
            ],
        ]);
    }
} 