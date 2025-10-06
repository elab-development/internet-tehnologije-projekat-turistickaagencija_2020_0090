<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
     public function up()
    {
        Schema::table('arrangements', function (Blueprint $table) {
            
            if (!Schema::hasColumn('arrangements', 'start_date')) {
                $table->timestamp('start_date')->nullable();
            }
            if (!Schema::hasColumn('arrangements', 'end_date')) {
                $table->timestamp('end_date')->nullable();
            }
            if (!Schema::hasColumn('arrangements', 'available_spots')) {
                $table->integer('available_spots')->default(0);
            }
            
        });
    }

    public function down()
    {
        Schema::table('arrangements', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date', 'available_spots']);
        });
    }
};
