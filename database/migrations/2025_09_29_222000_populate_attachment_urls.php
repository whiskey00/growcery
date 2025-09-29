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
        // Update existing messages that have attachment_path but no attachment_url
        $messages = DB::table('messages')
            ->whereNotNull('attachment_path')
            ->whereNull('attachment_url')
            ->get();

        foreach ($messages as $message) {
            $attachmentUrl = asset("storage/{$message->attachment_path}");
            DB::table('messages')
                ->where('id', $message->id)
                ->update(['attachment_url' => $attachmentUrl]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the changes
        DB::table('messages')
            ->whereNotNull('attachment_path')
            ->update(['attachment_url' => null]);
    }
};
