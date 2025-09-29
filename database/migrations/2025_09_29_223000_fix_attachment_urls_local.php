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
        // Update existing messages with correct local URLs
        $messages = DB::table('messages')
            ->whereNotNull('attachment_path')
            ->get();

        foreach ($messages as $message) {
            $attachmentUrl = 'http://127.0.0.1:8000/storage/' . $message->attachment_path;
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
