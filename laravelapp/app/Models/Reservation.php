<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
       'user_id',
        'arrangement_id',
        'offer_id',
        'status',
        'number_of_persons',
        'total_price',
        'discount_amount',
        'special_requests',
        'reservation_date',
        'is_paid',
        'paid_at'
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'reservation_date' => 'datetime',
        'paid_at' => 'datetime',
        'is_paid' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function arrangement(): BelongsTo
    {
        return $this->belongsTo(Arrangement::class);
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }
}
