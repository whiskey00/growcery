<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    protected $fillable = [
        'vendor_id',
        'customer_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latest();
    }

    /**
     * Get or create a room for a vendor-customer pair
     */
    public static function getOrCreateRoom(int $vendorId, int $customerId): self
    {
        return self::firstOrCreate([
            'vendor_id' => $vendorId,
            'customer_id' => $customerId,
        ]);
    }

    /**
     * Check if user is participant of this room
     */
    public function isParticipant(int $userId): bool
    {
        return $this->vendor_id === $userId || $this->customer_id === $userId;
    }
}
