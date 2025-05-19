<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\ProductBrowseController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Http\Controllers\Vendor\OrderController as VendorOrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public route
Route::get('/', function () {
    $user = auth()->user();

    return Inertia::render('Landing', [
        'isLoggedIn' => !!$user,
        'user' => $user,
        'role' => $user?->role,
    ]);
});

Route::get('/', [LandingPageController::class, 'index']);

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

    return app(AuthenticatedSessionController::class)->create(request());
})->name('login');

Route::get('/products', [ProductBrowseController::class, 'index'])->name('products.index');

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

    return app(RegisteredUserController::class)->create(request());
})->name('register');

// Authenticated users only
Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin-only
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

        // Users
        Route::resource('users', UserController::class);

        // Products
        Route::resource('products', AdminProductController::class);
        
        // Categories
        Route::resource('categories', CategoryController::class);

        // Orders
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
        Route::get('/', fn () => Inertia::render('Customer/Dashboard'))->name('dashboard');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    });

});

require __DIR__.'/auth.php';
