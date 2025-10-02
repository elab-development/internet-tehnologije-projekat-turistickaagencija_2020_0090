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
        Schema::create('arrangements', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_last_minute')->default(false);
            $table->boolean('is_early_booking')->default(false);
            $table->timestamp('special_offer_expires_at')->nullable();
            $table->string('transport_type')->nullable();
            $table->string('accommodation_type')->nullable();
            $table->string('image_url')->nullable();
            $table->foreignId('destination_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('arrangements');
    }
};
