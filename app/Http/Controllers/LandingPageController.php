<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $products = Product::where('status', 'published')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Landing', [
            'isLoggedIn' => !!$user,
            'user' => $user,
            'role' => $user?->role,
            'featuredProducts' => $products,
        ]);
    }
}
