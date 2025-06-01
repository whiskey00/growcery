<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MessageController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages/conversations', [MessageController::class, 'getConversations']);
    Route::get('/messages/conversations/{conversation}', [MessageController::class, 'getConversation']);
}); 