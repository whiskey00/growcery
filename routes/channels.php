<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Room;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat room authorization
Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
    $room = Room::find($roomId);
    
    // Check if user is a participant in this room
    return $room && $room->isParticipant($user->id);
});
