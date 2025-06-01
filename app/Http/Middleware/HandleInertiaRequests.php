<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
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
        $user = $request->user();
        $actingAs = session('acting_as');
        
        // Get cart items for customers
        $cartItems = [];
        if ($user && ($user->role === 'customer' || ($user->role === 'vendor' && $actingAs === 'customer'))) {
            $cartItems = $user->cartItems()
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

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
                'vendorApplication' => $user && $user->role === 'customer' ? 
                    \App\Models\VendorApplication::where('user_id', $user->id)
                        ->latest()
                        ->first() : null,
            ],
            'isLoggedIn' => $user !== null,
            'role' => $user?->role,
            'actingAs' => $actingAs,
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'cartItems' => $cartItems,
            'locale' => [
                'current' => App::getLocale(),
                'available' => ['en', 'tl'],
            ],
            'translations' => $this->getTranslations(),
        ]);
    }

    /**
     * Get all the translation messages for the current locale.
     *
     * @return array
     */
    protected function getTranslations(): array
    {
        $locale = App::getLocale();
        $translations = [];
        
        // Load the messages translations
        $messagesPath = lang_path("$locale/messages.php");
        if (file_exists($messagesPath)) {
            $translations = array_merge($translations, require $messagesPath);
        }
        
        return $translations;
    }
}
