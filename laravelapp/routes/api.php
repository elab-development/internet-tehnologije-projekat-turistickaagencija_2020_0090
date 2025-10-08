<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ArrangementController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\ReservationApiController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\Auth\ApiRegisteredUserController;
use App\Http\Controllers\Auth\ApiLoginUserController;
use App\Http\Controllers\Auth\ApiLogoutUserController;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\AdminMiddleware;

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

// Destinacije – lista i pretraga
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/search', [DestinationController::class, 'search']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

// CRUD destinacija (agent/admin)
Route::middleware(['auth:sanctum', RoleMiddleware::class.':agent,admin'])->group(function () {
    Route::post('/destinations', [DestinationController::class, 'store']);
    Route::put('/destinations/{destination}', [DestinationController::class, 'update']);
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy']);
});

Route::prefix('offers')->group(function () {
    Route::get('/', [OfferController::class, 'index']);
    Route::get('/last-minute', [OfferController::class, 'lastMinute']);
    Route::get('/early-booking', [OfferController::class, 'earlyBooking']);
    Route::get('/{offer}', [OfferController::class, 'show']);

    // CRUD za ponude (agent/admin)
    Route::middleware(['auth:sanctum', RoleMiddleware::class.':agent,admin'])->group(function () {
        Route::post('/', [OfferController::class, 'store']);
        Route::put('/{offer}', [OfferController::class, 'update']);
        Route::delete('/{offer}', [OfferController::class, 'destroy']);
    });
});

Route::middleware(['auth:sanctum', RoleMiddleware::class.':admin'])->prefix('admin')->group(function () {
    Route::get('/reservations', function (Request $request) {
        $reservations = \App\Models\Reservation::with(['user','arrangement.destination'])->latest()->paginate(15);
        return response()->json($reservations);
    });
    Route::get('/users', [AdminController::class, 'users']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::get('/activities', [AdminController::class, 'activities']);
    Route::get('/offers', [OfferController::class, 'adminIndex']);
});

Route::get('/arrangements', [ArrangementController::class, 'index']);

Route::middleware(['auth:sanctum', RoleMiddleware::class.':admin'])->post('/upload', [UploadController::class, 'store']);

//Route::middleware('auth:sanctum')->post('/reservations', [ReservationApiController::class, 'store']);

   Route::middleware(['auth:sanctum',RoleMiddleware::class. ':client'])->group(function () {

    Route::post('/reservations', [ReservationApiController::class, 'store']);



});

Route::middleware('guest')->group(function () {

    Route::post('register', [ApiRegisteredUserController::class, 'store']);

    Route::post('login', [ApiLoginUserController::class, 'login']);

});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()?->delete();
    return response()->json(['message' => 'Odjavljeno']);
});
