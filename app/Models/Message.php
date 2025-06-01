<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'receiver_id',
        'message_text',
        'read_by_receiver_at',
    ];

    protected $casts = [
        'read_by_receiver_at' => 'datetime',
    ];

    protected $with = ['sender'];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function markAsRead()
    {
        if (!$this->read_by_receiver_at) {
            $this->update(['read_by_receiver_at' => now()]);
        }
    }

    public function isUnread()
    {
        return is_null($this->read_by_receiver_at);
    }

    public function isSentBy(User $user)
    {
        return $this->sender_id === $user->id;
    }
} 