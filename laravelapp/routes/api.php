<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ArrangementController;
use App\Http\Controllers\Auth\ApiRegisteredUserController;
use App\Http\Controllers\Auth\ApiLoginUserController;
use App\Http\Controllers\Auth\ApiLogoutUserController;
use App\Http\Middleware\RoleMiddleware;

Route::prefix('arrangements')->group(function () {
    Route::get('/search', [ArrangementController::class, 'search']);
    Route::get('/last-minute', [ArrangementController::class, 'lastMinute']);
    Route::get('/popular', [ArrangementController::class, 'popular']);
    Route::get('/statistics', [ArrangementController::class, 'statistics']);
    Route::get('/active', [ArrangementController::class, 'active']);
    Route::get('/{arrangement}/similar', [ArrangementController::class, 'similar']);
    Route::get('/{arrangement}', [ArrangementController::class, 'show']);
    
   //agent ili admin
    Route::middleware(['auth:sanctum', RoleMiddleware::class.':agent,admin'])->group(function () {
        Route::post('/', [ArrangementController::class, 'store']);
        Route::put('/{arrangement}', [ArrangementController::class, 'update']);
        Route::delete('/{arrangement}', [ArrangementController::class, 'destroy']);
        Route::get('/mine/list', [ArrangementController::class, 'mine']);
    });
});

Route::get('/arrangements', [ArrangementController::class, 'index']);

Route::middleware('guest')->group(function () {

    Route::post('register', [ApiRegisteredUserController::class, 'store']);

    Route::post('login', [ApiLoginUserController::class, 'login']);

});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()?->delete();
    return response()->json(['message' => 'Odjavljeno']);
});
