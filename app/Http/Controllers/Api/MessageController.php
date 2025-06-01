<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        try {
            $conversations = Conversation::query()
                ->where(function($query) use ($request) {
                    $query->where('customer_id', $request->user()->id)
                        ->orWhere('vendor_id', $request->user()->id);
                })
                ->with(['customer:id,name', 'vendor:id,name'])
                ->withCount(['messages as unread_count' => function($query) use ($request) {
                    $query->where('receiver_id', $request->user()->id)
                        ->whereNull('read_by_receiver_at');
                }])
                ->with(['messages' => function($query) {
                    $query->latest()->first();
                }])
                ->latest('last_message_at')
                ->get()
                ->map(function ($conversation) {
                    $conversation->last_message = $conversation->messages->first();
                    unset($conversation->messages);
                    return $conversation;
                });

            return response()->json([
                'conversations' => $conversations
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching conversations: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch conversations'
            ], 500);
        }
    }

    public function getConversation(Request $request, Conversation $conversation)
    {
        try {
            // Authorize access
            if ($conversation->customer_id !== $request->user()->id && 
                $conversation->vendor_id !== $request->user()->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $conversation->load([
                'messages' => function($query) {
                    $query->with('sender:id,name')->latest();
                },
                'customer:id,name',
                'vendor:id,name',
                'product:id,name',
                'order:id'
            ]);

            // Mark messages as read
            $conversation->messages()
                ->where('receiver_id', $request->user()->id)
                ->whereNull('read_by_receiver_at')
                ->update(['read_by_receiver_at' => now()]);

            return response()->json([
                'conversation' => $conversation
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching conversation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch conversation'
            ], 500);
        }
    }
} 