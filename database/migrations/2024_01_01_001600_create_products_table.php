<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');

            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->text('description')->nullable();
            $table->integer('quantity')->default(0);
            $table->json('options')->nullable(); // e.g. [{label: '1kg', price: 50}]
            $table->string('image')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
