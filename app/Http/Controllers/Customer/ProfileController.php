<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Customer/Profile/Index', [
            'user' => auth()->user(),
        ]);
    }
    public function edit()
    {
        return Inertia::render('Customer/Profile/Edit', [
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        
        // Debug incoming values
        Log::info('📦 Incoming payload:', $request->all());


        $request->validate([
            'full_name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:1000',
        ]);

        $user = auth()->user();

        $user->update([
            'full_name' => $request->full_name,
            'mobile_number' => $request->mobile_number,
            'shipping_address' => $request->shipping_address,
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
