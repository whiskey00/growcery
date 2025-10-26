<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Product extends Model
{
    protected $fillable = [
        'vendor_id',
        'category_id',
        'date_harvested',
        'expected_lifespan_days',
        'name',
        'price',
        'status',
        'description',
        'options',
        'quantity',
        'image',
        'average_rating',
    ];

    protected $casts = [
        'options' => 'array',
        'price' => 'decimal:2',
        'date_harvested' => 'date',
        'expected_lifespan_days' => 'integer',
        'average_rating' => 'decimal:1',
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class);
    }

    public function category()
    {
        return $this->belongsTo(\App\Models\Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * Get the expiry date based on harvest date and lifespan
     */
    public function getExpiryDateAttribute()
    {
        if (!$this->date_harvested || !$this->expected_lifespan_days) {
            return null;
        }
        return $this->date_harvested->addDays($this->expected_lifespan_days);
    }

    /**
     * Get days until expiry (negative if expired)
     */
    public function getDaysUntilExpiryAttribute()
    {
        if (!$this->expiry_date) {
            return null;
        }
        
        $now = now()->startOfDay();
        $expiryDate = $this->expiry_date->startOfDay();
        
        if ($expiryDate->isFuture()) {
            return $now->diffInDays($expiryDate, false);
        } else {
            return -1 * $now->diffInDays($expiryDate, false);
        }
    }
}
