<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->redirectBasedOnRole($request);
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return $this->redirectBasedOnRole($request);
    }

    /**
     * Determine redirect path based on user role.
     */
    protected function redirectBasedOnRole($request): RedirectResponse
    {
        return match ($request->user()->role) {
            'admin' => redirect('/admin?verified=1'),
            'vendor' => redirect('/vendor?verified=1'),
            'customer' => redirect('/customer?verified=1'),
            default => redirect('/?verified=1'),
        };
    }
}
