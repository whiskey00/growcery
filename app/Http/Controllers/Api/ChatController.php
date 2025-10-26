<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    /**
     * Get or create a chat room between vendor and customer
     */
    public function getRoom(Request $request): JsonResponse
    {
        try {
            \Log::info('Chat getRoom request:', $request->all());
            
            $validated = $request->validate([
                'vendor_id' => 'required|exists:users,id',
                'customer_id' => 'required|exists:users,id',
            ]);
        } catch (\Exception $e) {
            \Log::error('Chat getRoom validation error: ' . $e->getMessage());
            return response()->json(['error' => 'Validation failed: ' . $e->getMessage()], 422);
        }

        // Verify the users have the correct roles
        $vendor = User::findOrFail($validated['vendor_id']);
        $customer = User::findOrFail($validated['customer_id']);

        if ($vendor->role !== 'vendor') {
            throw ValidationException::withMessages([
                'vendor_id' => 'User must be a vendor.'
            ]);
        }

        if ($customer->role !== 'customer') {
            throw ValidationException::withMessages([
                'customer_id' => 'User must be a customer.'
            ]);
        }

        // Ensure the authenticated user is one of the participants
        $authUser = Auth::user();
        if (!in_array($authUser->id, [$validated['vendor_id'], $validated['customer_id']])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $room = Room::getOrCreateRoom($validated['vendor_id'], $validated['customer_id']);

        return response()->json([
            'room' => [
                'id' => $room->id,
                'vendor_id' => $room->vendor_id,
                'customer_id' => $room->customer_id,
                'vendor' => $room->vendor->only(['id', 'name']),
                'customer' => $room->customer->only(['id', 'name']),
            ]
        ]);
    }

    /**
     * Get messages for a specific room
     */
    public function getMessages(Request $request, $roomId): JsonResponse
    {
        try {
            \Log::info('Getting messages for room: ' . $roomId);
            \Log::info('Auth user ID: ' . Auth::id());
            \Log::info('Auth user: ' . json_encode(Auth::user()));
            
            $room = Room::findOrFail($roomId);
            \Log::info('Room found: ' . json_encode($room));
            
            // Check if user is participant
            if (!$room->isParticipant(Auth::id())) {
                \Log::warning('User not participant in room');
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        } catch (\Exception $e) {
            \Log::error('Error in getMessages: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Internal server error: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }

        try {
            \Log::info('Fetching messages for room...');
            $messages = $room->messages()
                ->with('sender:id,name')
                ->orderBy('created_at', 'asc')
                ->get();
            
            \Log::info('Messages count: ' . $messages->count());
            
            $formattedMessages = $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'room_id' => $message->room_id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'message' => $message->message,
                    'type' => $message->type,
                    'attachment_path' => $message->attachment_path,
                    'attachment_url' => $message->attachment_url,
                    'mime' => $message->mime,
                    'bytes' => $message->bytes,
                    'width' => $message->width,
                    'height' => $message->height,
                    'formatted_size' => $message->formatted_size,
                    'read_at' => $message->read_at?->toIso8601String(),
                    'created_at' => $message->created_at->toIso8601String(),
                    'sender' => $message->sender->only(['id', 'name']),
                ];
            });

            return response()->json(['messages' => $formattedMessages]);
        } catch (\Exception $e) {
            \Log::error('Error fetching messages: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error fetching messages: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            \Log::info('Sending message: ', $request->all());
            
            $validated = $request->validate([
                'room_id' => 'required|exists:rooms,id',
                'receiver_id' => 'required|exists:users,id',
                'message' => 'nullable|string|max:2000',
                'image' => 'nullable|file|mimetypes:image/jpeg,image/png,image/gif,image/webp|max:5120', // 5MB
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in sendMessage: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Internal server error: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }

        $room = Room::findOrFail($validated['room_id']);
        
        // Check if user is participant
        if (!$room->isParticipant(Auth::id())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Verify receiver is the other participant
        $receiverId = $validated['receiver_id'];
        if (!$room->isParticipant($receiverId) || $receiverId === Auth::id()) {
            return response()->json(['error' => 'Invalid receiver'], 400);
        }

        // Prepare message data
        $messageData = [
            'room_id' => $validated['room_id'],
            'sender_id' => Auth::id(),
            'receiver_id' => $receiverId,
            'message' => $validated['message'] ?? ($request->hasFile('image') ? 'Attachment' : null),
            'type' => $request->hasFile('image') ? 'image' : 'text',
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store("chat/rooms/{$validated['room_id']}", 'public');
            
            // Hostinger-specific file handling - copy to public_html/storage
            // Only do this if we're on Hostinger (check if public_html directory exists)
            if (is_dir(base_path('../public_html'))) {
                $source = storage_path('app/public/' . $path);
                $destination = base_path('../public_html/storage/' . $path);
                
                File::ensureDirectoryExists(dirname($destination));
                File::copy($source, $destination);
            }
            
            $messageData['attachment_path'] = $path;
            $messageData['attachment_url'] = asset("storage/{$path}");
            $messageData['mime'] = $file->getMimeType();
            $messageData['bytes'] = $file->getSize();
            
            // Get image dimensions if it's an image
            if (str_starts_with($file->getMimeType(), 'image/')) {
                $imageInfo = getimagesize($file->getPathname());
                if ($imageInfo) {
                    $messageData['width'] = $imageInfo[0];
                    $messageData['height'] = $imageInfo[1];
                }
            }
        }

        // Create the message
        $message = Message::create($messageData);

        // Update room's last message time
        $room->update(['last_message_at' => now()]);

        // Load sender relationship
        $message->load('sender:id,name');

        // Broadcast the event
        \Log::info('Broadcasting message for room: ' . $message->room_id);
        \Log::info('Broadcasting driver: ' . config('broadcasting.default'));
        \Log::info('Ably key configured: ' . (config('broadcasting.connections.ably.key') ? 'Yes' : 'No'));
        
        try {
            $event = new MessageSent($message);
            \Log::info('Event created, broadcasting...');
            broadcast($event);
            \Log::info('Message broadcast completed successfully');
        } catch (\Exception $e) {
            \Log::error('Broadcast failed: ' . $e->getMessage());
            \Log::error('Broadcast error trace: ' . $e->getTraceAsString());
        }

        return response()->json([
            'message' => [
                'id' => $message->id,
                'room_id' => $message->room_id,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'message' => $message->message,
                'type' => $message->type,
                'attachment_path' => $message->attachment_path,
                'attachment_url' => $message->attachment_url,
                'mime' => $message->mime,
                'bytes' => $message->bytes,
                'width' => $message->width,
                'height' => $message->height,
                'read_at' => $message->read_at?->toIso8601String(),
                'created_at' => $message->created_at->toIso8601String(),
                'sender' => $message->sender->only(['id', 'name']),
            ]
        ], 201);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request, $roomId): JsonResponse
    {
        $room = Room::findOrFail($roomId);
        
        // Check if user is participant
        if (!$room->isParticipant(Auth::id())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Mark all unread messages in this room as read for the current user
        Message::where('room_id', $roomId)
            ->where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Get user's chat rooms
     */
    public function getRooms(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            \Log::info('Getting rooms for user: ' . $user->id);
            
            $rooms = Room::where(function ($query) use ($user) {
                    $query->where('vendor_id', $user->id)
                          ->orWhere('customer_id', $user->id);
                })
                ->with(['vendor:id,name', 'customer:id,name'])
                ->orderByDesc('updated_at')
                ->get();
            
            \Log::info('Found rooms count: ' . $rooms->count());
            
            $formattedRooms = $rooms->map(function ($room) use ($user) {
                try {
                    $otherUser = $room->vendor_id === $user->id ? $room->customer : $room->vendor;
                    
                    // Get latest message separately to avoid eager loading issues
                    $latestMessage = $room->messages()->with('sender:id,name')->latest()->first();
                    
                    return [
                        'id' => $room->id,
                        'vendor_id' => $room->vendor_id,
                        'customer_id' => $room->customer_id,
                        'vendor' => $room->vendor->only(['id', 'name']),
                        'customer' => $room->customer->only(['id', 'name']),
                        'other_user' => $otherUser->only(['id', 'name']),
                        'last_message_at' => $room->last_message_at?->toIso8601String(),
                        'latest_message' => $latestMessage ? [
                            'message' => $latestMessage->message,
                            'sender_name' => $latestMessage->sender->name,
                            'created_at' => $latestMessage->created_at->toIso8601String(),
                        ] : null,
                    ];
                } catch (\Exception $e) {
                    \Log::error('Error formatting room ' . $room->id . ': ' . $e->getMessage());
                    return null;
                }
            })->filter(); // Remove null entries

            return response()->json(['rooms' => $formattedRooms]);
        } catch (\Exception $e) {
            \Log::error('Error in getRooms: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error fetching rooms: ' . $e->getMessage(),
                'rooms' => []
            ], 500);
        }
    }
}