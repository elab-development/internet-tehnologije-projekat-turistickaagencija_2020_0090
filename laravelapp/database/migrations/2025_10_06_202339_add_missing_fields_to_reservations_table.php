<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reservations', function (Blueprint $table) {
            
            if (!Schema::hasColumn('reservations', 'special_requests')) {
                $table->text('special_requests')->nullable();
            }
            if (!Schema::hasColumn('reservations', 'reservation_date')) {
                $table->timestamp('reservation_date')->nullable();
            }
            if (!Schema::hasColumn('reservations', 'is_paid')) {
                $table->boolean('is_paid')->default(false);
            }
            if (!Schema::hasColumn('reservations', 'paid_at')) {
                $table->timestamp('paid_at')->nullable();
            }
            
        });
    }

     public function down()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['special_requests', 'reservation_date', 'is_paid','paid_at']);
        });
    }

};
