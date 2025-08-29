<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->string('option_label')->nullable();
            $table->decimal('option_price', 10, 2)->default(0);
            $table->timestamps();

            // Ensure a user can't add the same product with same option twice
            $table->unique(['user_id', 'product_id', 'option_label']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
}; 