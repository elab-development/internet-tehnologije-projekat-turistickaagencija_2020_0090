<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ArrangementController;

Route::prefix('arrangements')->group(function () {
    Route::get('/search', [ArrangementController::class, 'search']);
    Route::get('/last-minute', [ArrangementController::class, 'lastMinute']);
    Route::get('/popular', [ArrangementController::class, 'popular']);
    Route::get('/statistics', [ArrangementController::class, 'statistics']);
    Route::get('/active', [ArrangementController::class, 'active']);
    Route::get('/{arrangement}/similar', [ArrangementController::class, 'similar']);
    Route::get('/{arrangement}', [ArrangementController::class, 'show']);
    

});

Route::get('/arrangements', [ArrangementController::class, 'index']);
