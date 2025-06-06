<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\VendorApplication;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => User::count(),
                'products' => Product::count(),
                'orders' => Order::count(),
                'pendingApplications' => VendorApplication::where('status', 'pending')->count(),
            ],
        ]);
    }
}
