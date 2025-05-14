<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $vendorId = Auth::id();

        $orders = Order::where('vendor_id', $vendorId)
            ->with(['products' => function ($query) {
                $query->select('products.id', 'name', 'price');
            }])
            ->get();

        return Inertia::render('Vendor/Orders/Index', [
            'orders' => $orders
        ]);
    }
}
