<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleSwitchController extends Controller
{
    public function switch(Request $request)
    {
        if (!auth()->check() || auth()->user()->role !== 'vendor') {
            abort(403);
        }

        $currentView = $request->session()->get('acting_as', 'vendor');
        $newView = $currentView === 'vendor' ? 'customer' : 'vendor';
        
        $request->session()->put('acting_as', $newView);

        // Redirect to appropriate dashboard
        return redirect($newView === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    }
} 