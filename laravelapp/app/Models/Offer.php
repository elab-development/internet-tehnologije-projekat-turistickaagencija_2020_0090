<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = [
        'name',
        'arrangement_id',
        'type',
        'discount_percentage',
        'valid_from',
        'valid_until',
        'is_active',
        'description'
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
        'discount_percentage' => 'decimal:2'
    ];

    public function arrangement(): BelongsTo
    {
        return $this->belongsTo(Arrangement::class);
    }
}
