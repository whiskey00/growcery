<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('category'); // e.g. Fruits, Vegetables, Grains
            $table->decimal('price', 10, 2);
            $table->text('description')->nullable();
            $table->integer('quantity')->default(0);
            $table->json('options')->nullable(); // e.g. ["1kg", "5kg"]
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
