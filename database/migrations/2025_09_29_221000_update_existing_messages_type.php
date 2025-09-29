<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing messages that have attachment_path but no type
        DB::table('messages')
            ->whereNotNull('attachment_path')
            ->whereNull('type')
            ->update(['type' => 'image']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the changes
        DB::table('messages')
            ->where('type', 'image')
            ->whereNotNull('attachment_path')
            ->update(['type' => null]);
    }
};
