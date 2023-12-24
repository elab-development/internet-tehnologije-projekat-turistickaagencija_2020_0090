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
        Schema::table('arrangements', function (Blueprint $table){
            $table->renameColumn('start-date','start_date');
            $table->renameColumn('end-date','end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('arrangements', function (Blueprint $table){
            $table->renameColumn('start_date','start-date');
            $table->renameColumn('end_date','end-date');
        });
    }
};
