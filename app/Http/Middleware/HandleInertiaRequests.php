<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\App;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        // Get cart items for customers
        $cartItems = $this->getCartItems($request);
        
        // Get vendor order counts
        $vendorOrderCounts = $this->getVendorOrderCounts($request);
        
        // Get vendor expiry counts
        $vendorExpiryCounts = $this->getVendorExpiryCounts($request);

        return array_merge(parent::share($request), [
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $request->user(),
                'vendorApplication' => $request->user() && $request->user()->role === 'customer' ? 
                    \App\Models\VendorApplication::where('user_id', $request->user()->id)
                        ->latest()
                        ->first() : null,
            ],
            'isLoggedIn' => $request->user() !== null,
            'role' => $request->user()?->role,
            'actingAs' => session('acting_as'),
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'cartItems' => $cartItems,
            'vendorOrderCounts' => $vendorOrderCounts,
            'vendorExpiryCounts' => $vendorExpiryCounts,
            'translations' => $this->getTranslations(),
        ]);
    }

    /**
     * Get the translation messages for the current locale.
     *
     * @return array
     */
    protected function getTranslations(): array
    {
        $locale = App::getLocale();
        $translations = [];

        // Load messages translations
        $messagesPath = lang_path("{$locale}/messages.php");
        if (file_exists($messagesPath)) {
            $translations = require $messagesPath;
        }

        return $translations;
    }

    /**
     * Get cart items for the current user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function getCartItems($request)
    {
        $user = $request->user();
        if (!$user || !($user->role === 'customer' || ($user->role === 'vendor' && session('acting_as') === 'customer'))) {
            return [];
        }

        return $user->cartItems()
            ->with(['product' => function ($query) {
                $query->with('vendor');
            }])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product->name,
                    'image' => $item->product->image,
                    'vendor' => $item->product->vendor,
                    'quantity' => $item->quantity,
                    'selectedOption' => [
                        'label' => $item->option_label,
                        'price' => $item->option_price,
                    ],
                ];
            });
    }

    /**
     * Get order counts by status for vendors.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function getVendorOrderCounts($request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'vendor') {
            return [];
        }

        $orderCounts = Order::where('vendor_id', $user->id)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'to_pay' => $orderCounts['to_pay'] ?? 0,
            'to_ship' => $orderCounts['to_ship'] ?? 0,
            'to_receive' => $orderCounts['to_receive'] ?? 0,
            'completed' => $orderCounts['completed'] ?? 0,
            'cancelled' => $orderCounts['cancelled'] ?? 0,
        ];
    }

    /**
     * Get expiry counts for vendor products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function getVendorExpiryCounts($request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'vendor') {
            return [];
        }

        $products = Product::where('vendor_id', $user->id)
            ->whereNotNull('date_harvested')
            ->whereNotNull('expected_lifespan_days')
            ->get();
        
        $expiredCount = 0;
        $expiringSoonCount = 0;
        
        foreach ($products as $product) {
            $daysUntilExpiry = $product->days_until_expiry;
            if ($daysUntilExpiry !== null) {
                if ($daysUntilExpiry <= 0) {
                    $expiredCount++;
                } elseif ($daysUntilExpiry <= config('growcery.expiry_warning_days', 3)) {
                    $expiringSoonCount++;
                }
            }
        }

        return [
            'expired' => $expiredCount,
            'expiring_soon' => $expiringSoonCount,
        ];
    }
}
