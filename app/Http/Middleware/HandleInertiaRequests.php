<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $actingAs = $user && $user->role === 'vendor' ? 
            $request->session()->get('acting_as', 'vendor') : 
            $user?->role;
        
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'isLoggedIn' => $user !== null,
            'role' => $user?->role,
            'actingAs' => $actingAs,
            'vendorApplication' => $user && $user->role === 'customer' ? 
                \App\Models\VendorApplication::where('user_id', $user->id)
                    ->latest()
                    ->first() : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
