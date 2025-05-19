<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Product;
use App\Policies\ProductPolicy;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => auth()->check() ? auth()->user() : null,
                ];
            },
        ]);
    }

}
