<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\ProductBrowseController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Http\Controllers\Vendor\OrderController as VendorOrderController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\CustomerDashboardController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public route
Route::get('/', [LandingPageController::class, 'index']);

// Global dashboard redirect based on role
Route::get('/dashboard', function () {
    $role = auth()->user()?->role;

    return match ($role) {
        'admin' => redirect()->route('admin.dashboard'),
        'vendor' => redirect()->route('vendor.dashboard'),
        'customer' => redirect()->route('customer.dashboard'),
        default => abort(403),
    };
})->middleware(['auth'])->name('dashboard');

// Login
Route::get('/login', function () {
    if (auth()->check()) {
        return redirect(match (auth()->user()->role) {
            'admin' => '/admin',
            'vendor' => '/vendor',
            'customer' => '/customer',
            default => '/',
        });
    }

    return app(\App\Http\Controllers\Auth\AuthenticatedSessionController::class)->create(request());
})->name('login');

// Register
Route::get('/register', function () {
    if (auth()->check()) {
        return redirect(match (auth()->user()->role) {
            'admin' => '/admin',
            'vendor' => '/vendor',
            'customer' => '/customer',
            default => '/',
        });
    }

    return app(\App\Http\Controllers\Auth\RegisteredUserController::class)->create(request());
})->name('register');

// Product browsing
Route::get('/products', [ProductBrowseController::class, 'index'])->name('products.index');

// Authenticated users only
Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Admin-only
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

        Route::resource('users', UserController::class);
        Route::resource('products', AdminProductController::class);
        Route::resource('categories', CategoryController::class);

        Route::get('/orders', [\App\Http\Controllers\Admin\OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [\App\Http\Controllers\Admin\OrderController::class, 'show'])->name('orders.show');
    });

    // Vendor-only
    Route::middleware('role:vendor')->prefix('vendor')->name('vendor.')->group(function () {
        Route::get('/', fn () => redirect()->route('vendor.dashboard'));
        Route::get('/dashboard', [VendorDashboardController::class, 'index'])->name('dashboard');

        Route::resource('products', VendorProductController::class)->except(['show']);

        Route::get('/orders', [VendorOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [VendorOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status', [VendorOrderController::class, 'updateStatus'])->name('orders.updateStatus');
        Route::patch('/orders/{order}', [VendorOrderController::class, 'update'])->name('orders.update');
    });

    // Customer-only
    Route::middleware('role:customer')->prefix('customer')->name('customer.')->group(function () {
        Route::redirect('/', '/customer/dashboard');

        // Dashboard
        Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

        // Orders
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('customer.orders.show');


        // Profile
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.view');
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('customer.profile.edit');
        Route::put('/profile', [ProfileController::class, 'update'])->name('customer.profile.update');

        // Products & Cart
        Route::get('/products/{id}', [\App\Http\Controllers\Customer\ProductController::class, 'show'])->name('customer.products.show');
        Route::get('/cart', [CartController::class, 'index'])->name('customer.cart');

        // Checkout
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('customer.checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    });


});

require __DIR__.'/auth.php';
