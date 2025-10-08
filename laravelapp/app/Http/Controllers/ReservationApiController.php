<?php

namespace App\Http\Controllers;

use App\Mail\ReservationCreated;
use App\Models\Arrangement;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ReservationApiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'arrangement_id' => ['required', 'exists:arrangements,id'],
            'number_of_persons' => ['required', 'integer', 'min:1'],
            'special_requests' => ['nullable', 'string'],
        ]);

        $arrangement = Arrangement::query()->with('destination')->findOrFail($validated['arrangement_id']);

        if ($arrangement->available_spots < $validated['number_of_persons']) {
            return response()->json([
                'message' => 'Nema dovoljno slobodnih mesta za izabrani broj osoba.',
            ], 422);
        }

        $user = $request->user();
        $reservation = null;

        DB::transaction(function () use (&$reservation, $validated, $arrangement, $user) {
            $totalPrice = $arrangement->price * $validated['number_of_persons'];

            $reservation = Reservation::create([
                'user_id' => $user->id,
                'arrangement_id' => $arrangement->id,
                'number_of_persons' => $validated['number_of_persons'],
                'total_price' => $totalPrice,
                'status' => 'pending',
                'special_requests' => $validated['special_requests'] ?? null,
                'reservation_date' => now(),
                'is_paid' => false,
            ]);

            $arrangement->decrement('available_spots', $validated['number_of_persons']);
            $reservation->setRelation('arrangement', $arrangement->fresh(['destination']));
        });

        try {
            Mail::to($user->email)->send(new ReservationCreated($reservation));
        } catch (\Throwable $e) {
            Log::warning('Slanje email-a nije uspelo: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Rezervacija je uspešno kreirana.',
            'reservation' => $reservation->loadMissing(['arrangement.destination']),
        ], 201);
    }
}

