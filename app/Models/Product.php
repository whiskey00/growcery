<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Product extends Model
{
    protected $fillable = [
        'vendor_id',
        'name',
        'category',
        'price',
        'status',
        'description',
        'options',
        'quantity',
    ];

    protected $casts = [
        'options' => 'array', 
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product', 'product_id', 'order_id')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
