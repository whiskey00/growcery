<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorApplication extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'phone_number',
        'business_name',
        'farm_address',
        'produce_types',
        'id_document',
        'description',
        'status',
        'rejection_reason',
        'reviewed_at',
    ];

    protected $casts = [
        'produce_types' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 