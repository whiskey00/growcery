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
        // Get cart items for customers
        $cartItems = $this->getCartItems($request);

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
}
