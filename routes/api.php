<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API routes working']);
});

// Chat routes moved to routes/web.php for session auth compatibility 