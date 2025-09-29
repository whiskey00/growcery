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
        Schema::table('messages', function (Blueprint $table) {
            $table->enum('type', ['text', 'image'])->default('text')->after('message');
            $table->string('attachment_path')->nullable()->after('type');
            $table->string('attachment_url')->nullable()->after('attachment_path');
            $table->string('mime')->nullable()->after('attachment_url');
            $table->integer('bytes')->nullable()->after('mime');
            $table->integer('width')->nullable()->after('bytes');
            $table->integer('height')->nullable()->after('width');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'attachment_path',
                'attachment_url',
                'mime',
                'bytes',
                'width',
                'height'
            ]);
        });
    }
};
