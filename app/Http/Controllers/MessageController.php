<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Events\MessageSent;
use App\Events\NewMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'throttle:60,1']); // 60 requests per minute
    }

    public function index(Request $request)
    {
        $conversations = Conversation::query()
            ->where(function($query) use ($request) {
                $query->where('customer_id', $request->user()->id)
                    ->orWhere('vendor_id', $request->user()->id);
            })
            ->with(['customer', 'vendor'])
            ->withCount(['messages as unread_count' => function($query) use ($request) {
                $query->where('receiver_id', $request->user()->id)
                    ->whereNull('read_by_receiver_at');
            }])
            ->with(['messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->latest('last_message_at')
            ->paginate(20)
            ->through(function ($conversation) {
                // Add last_message to each conversation
                $conversation->last_message = $conversation->messages->first();
                unset($conversation->messages);
                return $conversation;
            });

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations
        ]);
    }

    public function show(Request $request, $conversationId = null)
    {
        $user = $request->user();
        
        if ($conversationId) {
            $conversation = Conversation::findOrFail($conversationId);
            
            // Authorize access
            if ($conversation->customer_id !== $user->id && $conversation->vendor_id !== $user->id) {
                abort(403);
            }
        } else {
            // Handle new conversation
            $validated = $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'product_id' => 'nullable|exists:products,id',
                'order_id' => 'nullable|exists:orders,id',
            ]);

            $receiver = User::findOrFail($validated['receiver_id']);

            // Verify sender and receiver roles
            if (!$this->canCommunicate($user, $receiver)) {
                abort(403, 'You cannot start a conversation with this user.');
            }

            // Get or create conversation
            $conversation = Conversation::firstOrCreate(
                [
                    'customer_id' => $user->role === 'customer' ? $user->id : $receiver->id,
                    'vendor_id' => $user->role === 'vendor' ? $user->id : $receiver->id,
                ],
                [
                    'product_id' => $validated['product_id'] ?? null,
                    'order_id' => $validated['order_id'] ?? null,
                    'last_message_at' => now(),
                ]
            );
        }

        // Load relationships with proper message ordering
        $conversation->load(['messages' => function($query) {
            $query->orderBy('created_at', 'asc');
        }, 'messages.sender', 'customer', 'vendor', 'product', 'order']);

        // Mark messages as read
        $conversation->messages()
            ->where('receiver_id', $user->id)
            ->whereNull('read_by_receiver_at')
            ->update(['read_by_receiver_at' => now()]);

        return Inertia::render('Messages/Show', [
            'conversation' => $conversation
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message_text' => 'required|string|max:1000',
            'product_id' => 'nullable|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        $sender = $request->user();
        $receiver = User::findOrFail($validated['receiver_id']);

        // Verify sender and receiver roles
        if (!$this->canCommunicate($sender, $receiver)) {
            throw ValidationException::withMessages([
                'receiver_id' => 'You cannot send messages to this user.'
            ]);
        }

        // Get or create conversation
        $conversation = Conversation::firstOrCreate(
            [
                'customer_id' => $sender->role === 'customer' ? $sender->id : $receiver->id,
                'vendor_id' => $sender->role === 'vendor' ? $sender->id : $receiver->id,
            ],
            [
                'product_id' => $validated['product_id'] ?? null,
                'order_id' => $validated['order_id'] ?? null,
                'last_message_at' => now(),
            ]
        );

        // Create message
        $message = $conversation->messages()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message_text' => $validated['message_text'],
        ]);

        // Load relationships
        $message->load('sender');
        $conversation->load(['messages' => function($query) {
            $query->orderBy('created_at', 'asc');
        }, 'messages.sender', 'customer', 'vendor', 'product', 'order']);

        // Update conversation last message timestamp
        $conversation->update(['last_message_at' => now()]);

        // Broadcast new message event
        broadcast(new NewMessage($message))->toOthers();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'conversation' => $conversation
            ]);
        }

        return back()->with([
            'success' => 'Message sent successfully.',
            'conversation' => $conversation
        ]);
    }

    private function canCommunicate(User $sender, User $receiver): bool
    {
        // Only allow customer-vendor communication
        return ($sender->role === 'customer' && $receiver->role === 'vendor') ||
               ($sender->role === 'vendor' && $receiver->role === 'customer');
    }
} 