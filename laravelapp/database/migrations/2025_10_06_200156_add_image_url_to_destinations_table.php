<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            if (! Schema::hasColumn('destinations', 'image_url')) {
                $table->string('image_url')->nullable()->after('description');
            }
        });
        
        if (Schema::hasColumn('destinations', 'image_path') && Schema::hasColumn('destinations', 'image_url')) {
            \DB::statement('UPDATE destinations SET image_url = COALESCE(image_url, image_path)');
        }
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            if (Schema::hasColumn('destinations', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });
    }
};
