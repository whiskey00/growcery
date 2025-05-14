<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
