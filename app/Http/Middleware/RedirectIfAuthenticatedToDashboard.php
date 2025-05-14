<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedToDashboard
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $role = auth()->user()->role;

            return match ($role) {
                'admin' => redirect('/admin'),
                'vendor' => redirect('/vendor'),
                'customer' => redirect('/customer'),
                default => redirect('/'),
            };
        }

        return $next($request);
    }
}
