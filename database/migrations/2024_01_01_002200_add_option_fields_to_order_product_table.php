<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('order_product', function (Blueprint $table) {
            $table->string('option_label')->nullable()->after('quantity');
            $table->decimal('option_price', 10, 2)->default(0)->after('option_label');
        });
    }

    public function down(): void {
        Schema::table('order_product', function (Blueprint $table) {
            $table->dropColumn(['option_label', 'option_price']);
        });
    }
};
