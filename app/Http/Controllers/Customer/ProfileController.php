<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Notifications\ProfileUpdatedNotification;
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
        
        // Store original values to detect changes
        $originalData = $user->only(['full_name', 'mobile_number', 'shipping_address']);
        
        // Update user data
        $user->update([
            'full_name' => $request->full_name,
            'mobile_number' => $request->mobile_number,
            'shipping_address' => $request->shipping_address,
        ]);

        // Detect changes and send notification
        $changes = $this->detectChanges($originalData, $request->only(['full_name', 'mobile_number', 'shipping_address']));
        
        if (!empty($changes)) {
            try {
                // Send email notification via Hostinger
                $user->notify(new ProfileUpdatedNotification($user, $changes));
                
                Log::info('Profile updated notification sent via Hostinger', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'changes' => array_keys($changes),
                    'timestamp' => now(),
                    'ip_address' => $request->ip()
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send profile update notification', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                    'timestamp' => now()
                ]);
            }
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Detect what fields have changed
     */
    private function detectChanges(array $original, array $new): array
    {
        $changes = [];
        
        foreach ($new as $field => $value) {
            if ($original[$field] !== $value) {
                $changes[$field] = [
                    'old' => $original[$field],
                    'new' => $value
                ];
            }
        }
        
        return $changes;
    }
}
