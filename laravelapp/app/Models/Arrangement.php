<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Arrangement extends Model
{
    protected $fillable = [
        'destination_id',
        'name',
        'description',
        'price',
        'original_price',
        'discount_percentage',
        'start_date',
        'end_date',
        'available_spots',
        'transport_type',
        'accommodation_type',
        'is_active',
        'is_last_minute',
        'is_early_booking',
        'special_offer_expires_at',
        'image_url',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'is_last_minute' => 'boolean',
    ];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
