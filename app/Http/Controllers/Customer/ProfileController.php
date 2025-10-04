<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Notifications\ProfileUpdateNotification;
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
        Log::info('🔍 Original data:', $originalData);
        
        // Update user data
        $user->update([
            'full_name' => $request->full_name,
            'mobile_number' => $request->mobile_number,
            'shipping_address' => $request->shipping_address,
        ]);

        // Detect changes and send notification
        $newData = $request->only(['full_name', 'mobile_number', 'shipping_address']);
        Log::info('🆕 New data:', $newData);
        
        $changes = $this->detectChanges($originalData, $newData);
        Log::info('🔄 Detected changes:', $changes);
        
        if (!empty($changes)) {
            try {
                // Send email notification via Hostinger
                Log::info('🚀 About to send notification...');
                $user->notify(new ProfileUpdateNotification($user, $changes));
                Log::info('📧 Notification sent successfully!');
                
                Log::info('✅ Profile updated notification sent via Hostinger', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'changes' => array_keys($changes),
                    'timestamp' => now(),
                    'ip_address' => $request->ip()
                ]);
            } catch (\Exception $e) {
                Log::error('❌ Failed to send profile update notification', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                    'timestamp' => now()
                ]);
            }
        } else {
            Log::info('ℹ️ No changes detected - notification not sent', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'original_data' => $originalData,
                'new_data' => $newData,
                'timestamp' => now()
            ]);
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
