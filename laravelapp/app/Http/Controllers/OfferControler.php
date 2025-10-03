<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OfferControler extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            \Log::info('Offer index request:', [
                'params' => $request->all(),
                'arrangement_id' => $request->arrangement_id
            ]);

            // Maro, ovo je osnovni upit za javni listing aktivnih ponuda.
            // Zašto: frontend treba samo ponude koje nisu istekle.
            // Ako zapne: proveri kolonu `valid_until` i timezone.
            $query = Offer::with('arrangement.destination')
                ->where('is_active', true)
                ->where('valid_until', '>', now());

            // Maro, ako prosledimo `arrangement_id`, filtriramo ponude za taj aranžman.
            // Zašto: admin panel može da gleda popuste po aranžmanu.
            // Ako zapne: proveri da li ID postoji u bazi.
            if ($request->has('arrangement_id')) {
                $query->where('arrangement_id', $request->arrangement_id);
            }

            $offers = $query->orderBy('valid_until')->paginate(9);

            \Log::info('Found offers:', ['count' => $offers->count()]);

            return response()->json($offers);
        } catch (\Exception $e) {
            \Log::error('Error in offer index:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Greška pri učitavanju ponuda',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $query = Offer::with('arrangement.destination');

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->where('is_active', true)->where('valid_until', '>=', now());
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($status === 'expired') {
                $query->where('valid_until', '<', now());
            }
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhereHas('arrangement', function ($arrangement) use ($q) {
                      $arrangement->where('name', 'like', "%{$q}%")
                        ->orWhereHas('destination', function ($destination) use ($q) {
                            $destination->where('name', 'like', "%{$q}%")
                              ->orWhere('country', 'like', "%{$q}%");
                        });
                  });
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 15;

        return response()->json(
            $query->orderByDesc('is_active')
                ->orderByDesc('valid_from')
                ->paginate($perPage)
        );
    }

    public function show(Offer $offer): JsonResponse
    {
        $offer->load('arrangement.destination');
        return response()->json($offer);
    }

    public function lastMinute(): JsonResponse
    {
        $offers = Offer::with('arrangement.destination')
            ->where('type', 'last_minute')
            ->where('is_active', true)
            ->where('valid_until', '>', now())
            ->orderBy('valid_until')
            ->paginate(9);

        return response()->json($offers);
    }

    public function earlyBooking(): JsonResponse
    {
        $offers = Offer::with('arrangement.destination')
            ->where('type', 'early_booking')
            ->where('is_active', true)
            ->where('valid_until', '>', now())
            ->orderBy('valid_until')
            ->paginate(9);

        return response()->json($offers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'arrangement_id' => 'required|integer|exists:arrangements,id',
            'type' => 'required|in:last_minute,early_booking',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'is_active' => 'boolean',
            'description' => 'nullable|string'
        ]);

        $offer = Offer::create($validated + ['is_active' => $request->boolean('is_active')]);
        return response()->json($offer->load('arrangement.destination'), 201);
    }

    public function update(Request $request, Offer $offer): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'arrangement_id' => 'sometimes|required|integer|exists:arrangements,id',
            'type' => 'sometimes|required|in:last_minute,early_booking',
            'discount_percentage' => 'sometimes|required|numeric|min:0|max:100',
            'valid_from' => 'sometimes|required|date',
            'valid_until' => 'sometimes|required|date|after:valid_from',
            'is_active' => 'boolean',
            'description' => 'nullable|string'
        ]);

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }

        $offer->update($validated);
        return response()->json($offer->refresh()->load('arrangement.destination'));
    }

    public function destroy(Offer $offer): JsonResponse
    {
        $offer->delete();
        return response()->json(null, 204);
    }
}
