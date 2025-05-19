<?php

namespace App\Http\Controllers\Customer;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;


class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */

    public function index()
    {
        return Inertia::render('Customer/Profile/Index', [
            'user' => auth()->user(),
        ]);
    }
    public function edit(Request $request): Response
    {
        return Inertia::render('Customer/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:1000',
            'mobile_number' => 'required|string|max:20',
        ]);

        $user = auth()->user();
        $user->full_name = $request->full_name;
        $user->shipping_address = $request->shipping_address;
        $user->mobile_number = $request->mobile_number;
        $user->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
