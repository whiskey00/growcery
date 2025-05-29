<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = auth()->user();
        if (!$user) {
            abort(403);
        }

        // If user is a vendor and acting as customer, allow access to customer routes
        if ($user->role === 'vendor' && 
            in_array('customer', $roles) && 
            session('acting_as') === 'customer') {
            return $next($request);
        }

        // If user is a vendor and trying to access vendor routes while acting as customer,
        // still allow access to vendor routes
        if ($user->role === 'vendor' && 
            in_array('vendor', $roles)) {
            return $next($request);
        }

        // For vendors, check if they're trying to access customer features
        if ($user->role === 'vendor' && 
            in_array('customer', $roles) && 
            !session()->has('acting_as')) {
            session(['acting_as' => 'vendor']);
        }

        // Regular role check
        if (!in_array($user->role, $roles)) {
            abort(403);
        }

        return $next($request);
    }
}
