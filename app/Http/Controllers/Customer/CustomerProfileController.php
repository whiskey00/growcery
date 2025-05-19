<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CustomerProfileController extends Controller
{
    public function edit()
    {
        return inertia('Customer/Profile/Edit', [
            'user' => auth()->user()
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'shipping_address' => 'required|string',
            'mobile_number' => 'required|string|max:15',
        ]);

        $user = auth()->user();
        $user->update($request->only('full_name', 'shipping_address', 'mobile_number'));

        return back()->with('success', 'Profile updated.');
    }
}
