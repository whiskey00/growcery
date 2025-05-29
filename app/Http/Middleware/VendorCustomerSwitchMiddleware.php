<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VendorCustomerSwitchMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'vendor') {
            abort(403);
        }

        // Store the original role in the session
        session(['acting_as' => $request->session()->get('acting_as', 'vendor')]);

        return $next($request);
    }
} 