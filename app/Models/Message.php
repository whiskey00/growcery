<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'room_id',
        'sender_id',
        'receiver_id',
        'message',
        'type',
        'attachment_path',
        'attachment_url',
        'mime',
        'bytes',
        'width',
        'height',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'bytes' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Mark message as read
     */
    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    /**
     * Check if message is read
     */
    public function isRead(): bool
    {
        return !is_null($this->read_at);
    }

    /**
     * Check if message has an attachment
     */
    public function hasAttachment(): bool
    {
        return !is_null($this->attachment_path);
    }

    /**
     * Check if message is an image
     */
    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    /**
     * Get formatted file size
     */
    public function getFormattedSizeAttribute(): string
    {
        if (!$this->bytes) {
            return '';
        }

        $bytes = $this->bytes;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
