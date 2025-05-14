<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProductController;
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
        Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

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
        Route::resource('products', ProductController::class);
    });

    // Vendor-only
    Route::middleware('role:vendor')->prefix('vendor')->name('vendor.')->group(function () {
        Route::get('/', fn () => Inertia::render('Vendor/Dashboard'))->name('dashboard');
    });

    // Customer-only
    Route::middleware('role:customer')->prefix('customer')->name('customer.')->group(function () {
        Route::get('/', fn () => Inertia::render('Customer/Dashboard'))->name('dashboard');
    });

});

require __DIR__.'/auth.php';
