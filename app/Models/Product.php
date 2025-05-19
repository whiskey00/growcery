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

    public function category()
    {
        return $this->belongsTo(\App\Models\Category::class);
    }

}
