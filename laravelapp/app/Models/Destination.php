<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    protected $fillable = [
        'name',
        'country',
        'description',
        'image_url'
    ];

    public function arrangements(): HasMany
    {
        return $this->hasMany(Arrangement::class);
    }
}
