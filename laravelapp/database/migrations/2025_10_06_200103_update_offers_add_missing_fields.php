<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            if (!Schema::hasColumn('offers', 'discount_percentage')) {
                $table->decimal('discount_percentage', 5, 2)->nullable()->after('discount');
            }
            if (!Schema::hasColumn('offers', 'valid_from')) {
                $table->timestamp('valid_from')->nullable()->after('type');
            }
            if (!Schema::hasColumn('offers', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('valid_until');
            }
            if (!Schema::hasColumn('offers', 'description')) {
                $table->text('description')->nullable()->after('is_active');
            }
        });
    }

    public function down(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            if (Schema::hasColumn('offers', 'discount_percentage')) {
                $table->dropColumn('discount_percentage');
            }
            if (Schema::hasColumn('offers', 'valid_from')) {
                $table->dropColumn('valid_from');
            }
            if (Schema::hasColumn('offers', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('offers', 'description')) {
                $table->dropColumn('description');
            }
        });
    }
};
