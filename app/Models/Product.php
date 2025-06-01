<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Product extends Model
{
    protected $fillable = [
        'vendor_id',
        'category_id',
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
}
