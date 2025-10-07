<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{
    protected $fillable = [
        'name',
        'arrangement_id',
        'type',
        'discount',
        'valid_from',
        'valid_until',
        'is_active',
        'description'
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'is_active' => 'boolean',
        'discount' => 'decimal:2'
    ];

    public function arrangement(): BelongsTo
    {
        return $this->belongsTo(Arrangement::class);
    }
}
