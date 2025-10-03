<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ArrangementController extends Controller
{
    public function index(Request $request)
    {
        \Log::info('Fetching arrangements', $request->all());

        
        $query = Arrangement::query()->with('destination');

        if ($request->boolean('mine') && $request->user() && $request->user()->role === 'agent') {
            $query->where('agent_id', $request->user()->id);
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%$q%")
                  ->orWhereHas('destination', function ($d) use ($q) {
                      $d->where('name', 'like', "%$q%")
                        ->orWhere('country', 'like', "%$q%");
                  });
            });
        }

        if ($request->filled('destination')) {
            $query->whereHas('destination', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->destination . '%');
            });
        }

        if ($request->filled('priceMin')) {
            $query->where('price', '>=', $request->priceMin);
        }

        if ($request->filled('priceMax')) {
            $query->where('price', '<=', $request->priceMax);
        }

        if ($request->filled('transport_type')) {
            $query->where('transport_type', $request->transport_type);
        }

        if ($request->filled('accommodation_type')) {
            $query->where('accommodation_type', $request->accommodation_type);
        }

        $sortField = $request->input('sort_by', 'price');
        $sortDirection = $request->input('sort_direction', 'asc');

        $validSortFields = ['price', 'start_date'];
        if (in_array($sortField, $validSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        \Log::info('Filters applied:', $request->all());

        $perPage = (int) $request->input('per_page', 9);
        $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 9;
        return $query->paginate($perPage);
    }

    public function show($id)
    {
        $arrangement = Arrangement::with('destination')->findOrFail($id);
        return response()->json($arrangement);
    }

    public function mine(Request $request)
    {
        $user = $request->user();
        if (! $user || $user->role !== 'agent') {
            return response()->json(['message' => 'Zabranjeno'], 403);
        }

        $query = Arrangement::with('destination')->where('agent_id', $user->id);

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%$q%")
                  ->orWhereHas('destination', function ($d) use ($q) {
                      $d->where('name', 'like', "%$q%")
                        ->orWhere('country', 'like', "%$q%");
                  });
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 15;
        $page = (int) $request->input('page', 1);

        return $query->orderBy('start_date')->paginate($perPage, ['*'], 'page', $page);
    }

    public function search(Request $request)
    {
        $destination     = $request->input('destination');
        $minPrice        = $request->input('min_price', $request->input('priceMin'));
        $maxPrice        = $request->input('max_price', $request->input('priceMax'));
        $transportType   = $request->input('transport_type');
        $accommodation   = $request->input('accommodation_type');
        $sort            = $request->input('sort', $request->input('sort_by', 'start_date'));
        $direction       = $request->input('sort_direction', 'asc');

        $query = Arrangement::query()->with('destination');

        if ($destination) {
            $query->whereHas('destination', function ($q) use ($destination) {
                $q->where('name', 'like', "%{$destination}%")
                  ->orWhere('country', 'like', "%{$destination}%");
            });
        }

        if ($minPrice !== null && $minPrice !== '') {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice !== null && $maxPrice !== '') {
            $query->where('price', '<=', $maxPrice);
        }
        if ($transportType) {
            $query->where('transport_type', $transportType);
        }
        if ($accommodation) {
            $query->where('accommodation_type', $accommodation);
        }

        $validSort = ['price', 'start_date', 'end_date', 'available_spots'];
        if (!in_array($sort, $validSort, true)) {
            $sort = 'start_date';
        }

        $direction = strtolower(trim((string) $direction));
        $direction = $direction === 'desc' ? 'desc' : 'asc';

        $column = 'arrangements.' . $sort;

        if ($direction === 'desc') {
            $query->orderByDesc($column);
        } else {
            $query->orderBy($column);
        }

        return $query->paginate(9);
    }

    public function popular(Request $request)
    {
        $arrangements = Arrangement::with('destination')
            ->withCount('reservations')
            ->orderByDesc('reservations_count')
            ->orderBy('price')
            ->paginate(9);

        return response()->json($arrangements);
    }

    public function statistics()
    {
        $byTransport = Arrangement::select('transport_type')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('transport_type')
            ->get();

        $byAccommodation = Arrangement::select('accommodation_type')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('accommodation_type')
            ->get();

        $activeCount = Arrangement::where('is_active', true)->count();
        $futureCount = Arrangement::whereDate('start_date', '>', now())->count();

        return response()->json([
            'by_transport' => $byTransport,
            'by_accommodation' => $byAccommodation,
            'active' => $activeCount,
            'upcoming' => $futureCount,
        ]);
    }

    public function active(Request $request)
    {
        $query = Arrangement::with('destination')
            ->where('is_active', true)
            ->whereDate('start_date', '>=', now()->toDateString())
            ->orderBy('start_date');

        return $query->paginate(9);
    }

    public function similar(Arrangement $arrangement)
    {
        $query = Arrangement::with('destination')
            ->where('id', '!=', $arrangement->id)
            ->where(function ($q) use ($arrangement) {
                $q->where('destination_id', $arrangement->destination_id)
                  ->orWhere('accommodation_type', $arrangement->accommodation_type)
                  ->orWhere('transport_type', $arrangement->transport_type);
            })
            ->orderBy('start_date');

        return $query->limit(9)->get();
    }

    public function lastMinute()
    {
        $arrangements = Arrangement::where('is_last_minute', true)
            ->where('is_active', true)
            ->with('destination')
            ->paginate(9);

        return response()->json($arrangements);
    }

    public function earlyBooking()
    {
        $arrangements = Arrangement::where('is_early_booking', true)
            ->where('is_active', true)
            ->with('destination')
            ->paginate(9);

        return response()->json($arrangements);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'destination_id' => 'required|exists:destinations,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'available_spots' => 'required|integer|min:0',
            'transport_type' => 'required|in:bus,airplane,own',
            'accommodation_type' => 'required|in:hotel,apartment,villa',
            'is_active' => 'sometimes|boolean',
            'image_url' => 'nullable|url',
        ]);

        $arrangement = Arrangement::create($validated + [
            'is_last_minute' => false,
            'is_early_booking' => false,
            'agent_id' => optional($request->user())->role === 'agent' ? $request->user()->id : null,
        ]);

        return response()->json($arrangement->load('destination'), 201);
    }

    public function update(Request $request, Arrangement $arrangement)
    {
        $validated = $request->validate([
            'destination_id' => 'sometimes|exists:destinations,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'available_spots' => 'sometimes|integer|min:0',
            'transport_type' => 'sometimes|in:bus,airplane,own',
            'accommodation_type' => 'sometimes|in:hotel,apartment,villa',
            'is_active' => 'sometimes|boolean',
            'image_url' => 'nullable|url',
            'is_last_minute' => 'sometimes|boolean',
            'is_early_booking' => 'sometimes|boolean',
        ]);

        $user = $request->user();
        if ($user && $user->role === 'agent' && $arrangement->agent_id && $arrangement->agent_id !== $user->id) {
            return response()->json(['message' => 'Zabranjeno: možete menjati samo svoje aranžmane.'], 403);
        }

        $arrangement->update($validated);
        return response()->json($arrangement->load('destination'));
    }

    public function destroy(Arrangement $arrangement)
    {
        $user = request()->user();
        if ($user && $user->role === 'agent' && $arrangement->agent_id && $arrangement->agent_id !== $user->id) {
            return response()->json(['message' => 'Zabranjeno: možete brisati samo svoje aranžmane.'], 403);
        }

        $arrangement->delete();
        return response()->json(['deleted' => true]);
    }
}
