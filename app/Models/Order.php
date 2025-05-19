<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'vendor_id',
        'total_price',
        'payment_method',
        'shipping_address',
        'status',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class)
            ->withPivot('quantity', 'option_label', 'option_price')
            ->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }



    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

}
