<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_product', function (Blueprint $table) {
            // Add columns only if they don't exist
            if (!Schema::hasColumn('order_product', 'created_at')) {
                $table->timestamps();
            }
            
            // Add unique constraint if it doesn't exist
            // Note: This might fail if there's existing duplicate data
            try {
                $table->unique(['order_id', 'product_id', 'option_label'], 'order_product_unique');
            } catch (\Exception $e) {
                // If the constraint already exists or there's duplicate data,
                // log the error but don't fail the migration
                \Log::warning('Could not add unique constraint to order_product table: ' . $e->getMessage());
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_product', function (Blueprint $table) {
            $table->dropUnique('order_product_unique');
            $table->dropTimestamps();
        });
    }
}; 