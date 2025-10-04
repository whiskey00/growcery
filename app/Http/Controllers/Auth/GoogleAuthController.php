<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'uid' => 'required|string',
        ]);

        // Check if user exists
        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Create new user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt(uniqid()), // random password
                'role' => 'customer', // default role
                'google_id' => $validated['uid'], // store Firebase UID
                'email_verified_at' => now(), // Google has already verified the email
            ]);
        } else {
            // If user exists but email is not verified, verify it since they're using Google
            if (!$user->hasVerifiedEmail()) {
                $user->update(['email_verified_at' => now()]);
            }
        }

        Auth::login($user);

        // Redirect based on user role
        return match ($user->role) {
            'admin' => redirect('/admin'),
            'vendor' => redirect('/vendor'),
            'customer' => redirect('/customer'),
            default => redirect('/'),
        };
    }
}
