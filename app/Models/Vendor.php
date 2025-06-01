<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'profile_image',
        'barangay',
        'city',
        'province',
        'rating',
        'is_active',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($vendor) {
            if (!$vendor->slug) {
                $vendor->slug = Str::slug($vendor->name);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function getFullAddressAttribute()
    {
        return "{$this->barangay}, {$this->city}, {$this->province}";
    }
} 