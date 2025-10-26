<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API routes working']);
});

// Simple chat test route (no auth required for testing)
Route::get('/chat/test', function () {
    return response()->json([
        'message' => 'Chat API is accessible',
        'timestamp' => now(),
        'csrf_token' => csrf_token(),
    ]);
});

// Chat API routes with session authentication
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/chat/room', [ChatController::class, 'getRoom']);
    Route::get('/chat/rooms', [ChatController::class, 'getRooms']);
    Route::get('/chat/rooms/{roomId}/messages', [ChatController::class, 'getMessages']);
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::post('/chat/rooms/{roomId}/read', [ChatController::class, 'markAsRead']);
    
    // Debug route to check chat system status
    Route::get('/chat/debug', function () {
        try {
            $roomsCount = \App\Models\Room::count();
            $messagesCount = \App\Models\Message::count();
            $usersCount = \App\Models\User::count();
            
            // Try to find room 2
            $room2 = \App\Models\Room::find(2);
            
            return response()->json([
                'rooms_count' => $roomsCount,
                'messages_count' => $messagesCount,
                'users_count' => $usersCount,
                'room_2_exists' => $room2 ? true : false,
                'room_2_data' => $room2,
                'auth_user' => auth()->user(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    });
}); 