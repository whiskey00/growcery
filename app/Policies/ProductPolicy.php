<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function update(User $user, Product $product)
    {
        return $user->id === $product->vendor_id;
    }

    public function delete(User $user, Product $product)
    {
        return $user->id === $product->vendor_id;
    }
}
