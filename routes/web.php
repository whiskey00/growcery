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
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Customer\QRPhPaymentController;
use App\Http\Controllers\Customer\VendorController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Api\MessageController as ApiMessageController;
use App\Http\Controllers\Vendor\ReviewController;

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

Route::post('/login/google', [GoogleAuthController::class, 'handle']);

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
        Route::get('/products', [VendorProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [VendorProductController::class, 'create'])->name('products.create');
        Route::post('/products', [VendorProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}', [VendorProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [VendorProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [VendorProductController::class, 'destroy'])->name('products.destroy');
        Route::get('/orders', [VendorOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [VendorOrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{order}/status', [VendorOrderController::class, 'updateStatus'])->name('orders.status.update');
        Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
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
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [CartController::class, 'add'])->name('cart.add');
        Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

        // Direct checkout routes
        Route::post('/direct-checkout', [CheckoutController::class, 'directCheckout'])->name('checkout.direct');
        Route::post('/direct-checkout/complete', [CheckoutController::class, 'completeDirectCheckout'])->name('checkout.direct.complete');
        
        // Regular checkout route
        Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

        // Vendor Application
        Route::get('/vendor-application/create', [App\Http\Controllers\Customer\VendorApplicationController::class, 'create'])
            ->name('vendor-application.create');
        Route::post('/vendor-application', [App\Http\Controllers\Customer\VendorApplicationController::class, 'store'])
            ->name('vendor-application.store');
        Route::get('/vendor-application/status', [App\Http\Controllers\Customer\VendorApplicationController::class, 'status'])
            ->name('vendor-application.status');
        Route::get('/vendor-application/{application}/document', [App\Http\Controllers\Customer\VendorApplicationController::class, 'viewDocument'])
            ->name('vendor-application.document');

        // QR Ph Payment Routes
        Route::post('/qrph/generate', [QRPhPaymentController::class, 'generateQR']);
        Route::post('/qrph/simulate-payment', [QRPhPaymentController::class, 'simulatePayment']);

        // Add vendor profile route here
        Route::get('/vendors/{vendor}', [VendorController::class, 'show'])->name('vendors.show');

        // Product Reviews
        Route::post('/reviews', [App\Http\Controllers\Customer\ProductReviewController::class, 'store'])
            ->name('reviews.store');
        Route::get('/products/{product}/reviews', [App\Http\Controllers\Customer\ProductReviewController::class, 'index'])
            ->name('products.reviews.index');
    });

    // Vendor role switch route
    Route::post('/vendor/switch-view', [App\Http\Controllers\Vendor\RoleSwitchController::class, 'switch'])
        ->name('vendor.switch-view');

    // Message routes
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/messages/new', [MessageController::class, 'show'])->name('messages.new');
    Route::get('/messages/{conversation}', [MessageController::class, 'show'])->name('messages.show');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
});

// Admin vendor application routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/vendor-applications', [App\Http\Controllers\Admin\VendorApplicationController::class, 'index'])
        ->name('admin.vendor-applications.index');
    Route::get('/admin/vendor-applications/{application}', [App\Http\Controllers\Admin\VendorApplicationController::class, 'show'])
        ->name('admin.vendor-applications.show');
    Route::post('/admin/vendor-applications/{application}/approve', [App\Http\Controllers\Admin\VendorApplicationController::class, 'approve'])
        ->name('admin.vendor-applications.approve');
    Route::post('/admin/vendor-applications/{application}/reject', [App\Http\Controllers\Admin\VendorApplicationController::class, 'reject'])
        ->name('admin.vendor-applications.reject');
    Route::delete('/admin/vendor-applications/{application}', [App\Http\Controllers\Admin\VendorApplicationController::class, 'destroy'])
        ->name('admin.vendor-applications.destroy');
    Route::get('/admin/vendor-applications/{application}/document', [App\Http\Controllers\Admin\VendorApplicationController::class, 'viewDocument'])
        ->name('admin.vendor-applications.document');
});

// Message API routes
Route::middleware(['auth'])->group(function () {
    Route::get('/api/messages/conversations', [ApiMessageController::class, 'getConversations']);
    Route::get('/api/messages/conversations/{conversation}', [ApiMessageController::class, 'getConversation']);
});

require __DIR__.'/auth.php';
